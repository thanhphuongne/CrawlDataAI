from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..mongodb import db
from ..utils.auth import get_current_user
from ..utils.ai_service import process_user_message, generate_response
from ..utils.crawler import execute_crawling
from ..models import Request, RequestStatus
from ..services.conversation_service import get_or_create_general_conversation, send_message_to_general_conversation
from ..services.request_service import create_request
from motor.motor_asyncio import AsyncIOMotorCollection
import json
from datetime import datetime

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: int):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)

manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = None,
    db_session: Session = Depends(get_db)
):
    if not token:
        await websocket.close(code=1008)
        return

    try:
        # Verify JWT token
        from ..utils.auth import verify_token
        payload = verify_token(token)
        user_id = int(payload.get("sub") or payload.get("id"))
        if not user_id:
            await websocket.close(code=1008)
            return
    except Exception:
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, user_id)

    # Send conversation history on connection
    try:
        conversation = await get_or_create_general_conversation(user_id)
        await websocket.send_text(json.dumps({
            "type": "conversation_history",
            "messages": conversation.get("messages", []),
            "conversation_id": conversation["_id"]
        }))
    except Exception as e:
        print(f"Error loading conversation history: {e}")

    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            if message_data.get("type") == "chat_message":
                content = message_data.get("content")
                request_id = message_data.get("request_id")

                if not content:
                    continue

                # Save user message to general conversation
                await send_message_to_general_conversation(user_id, content, "user")

                # Process message with AI
                ai_result = await process_user_message(content)

                if ai_result.get("isDataRequest"):
                    # Send formatted requirement for approval
                    await websocket.send_text(json.dumps({
                        "type": "data_request_proposal",
                        "requirement": ai_result["formattedRequirement"],
                        "explanation": ai_result["explanation"],
                        "message_id": datetime.now().timestamp()
                    }))
                else:
                    # Generate normal AI response
                    ai_response = await generate_response(content)

                    # Save AI response to general conversation
                    await send_message_to_general_conversation(user_id, ai_response, "assistant")

                    await websocket.send_text(json.dumps({
                        "type": "chat_response",
                        "message": ai_response,
                        "request_id": request_id
                    }))

            elif message_data.get("type") == "approve_data_request":
                requirement = message_data.get("requirement")

                # Create a new crawl request
                new_request = create_request(db_session, user_id, requirement)

                await websocket.send_text(json.dumps({
                    "type": "data_request_approved",
                    "request_id": new_request.id,
                    "status": new_request.status.value,
                    "message": "Data crawling request has been created and will start processing.",
                    "export_formats": ["json", "xlsx"],
                    "export_url": f"/api/data/{new_request.id}/"
                }))

                # Trigger actual crawling process asynchronously
                import asyncio
                asyncio.create_task(run_crawling_async(new_request.id, requirement, db, websocket))

            elif message_data.get("type") == "reject_data_request":
                await websocket.send_text(json.dumps({
                    "type": "data_request_rejected",
                    "message": "Data request cancelled. You can try rephrasing your request."
                }))

    except WebSocketDisconnect:
        manager.disconnect(user_id)
        print(f"User {user_id} disconnected")

async def run_crawling_async(request_id: int, requirement: str, db, websocket: WebSocket):
    """Run crawling asynchronously and send completion events"""
    try:
        await execute_crawling(request_id, requirement, db)
        await websocket.send_text(json.dumps({
            "type": "crawling_completed",
            "request_id": request_id,
            "message": "Data crawling has been completed successfully."
        }))
    except Exception as e:
        print(f"Crawling failed for request {request_id}: {e}")
        await websocket.send_text(json.dumps({
            "type": "crawling_failed",
            "request_id": request_id,
            "message": "Data crawling failed. Please try again."
        }))
