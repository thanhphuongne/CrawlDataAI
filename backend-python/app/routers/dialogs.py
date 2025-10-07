from fastapi import APIRouter, Depends, HTTPException
from ..mongodb import db
from ..utils.auth import get_current_user
from motor.motor_asyncio import AsyncIOMotorCollection
from typing import List

router = APIRouter()

@router.get("/conversations")
async def get_conversations(current_user = Depends(get_current_user)):
    """Get user's conversations"""
    try:
        conversations_collection: AsyncIOMotorCollection = db.conversations
        cursor = conversations_collection.find({"user_id": current_user.id})
        conversations = []

        async for conversation in cursor:
            conversation["_id"] = str(conversation["_id"])
            conversations.append(conversation)

        return {"conversations": conversations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving conversations: {str(e)}")

@router.get("/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    current_user = Depends(get_current_user)
):
    """Get a specific conversation"""
    try:
        from bson import ObjectId
        conversations_collection: AsyncIOMotorCollection = db.conversations
        conversation = await conversations_collection.find_one({
            "_id": ObjectId(conversation_id),
            "user_id": current_user.id
        })

        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        conversation["_id"] = str(conversation["_id"])
        return conversation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving conversation: {str(e)}")

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    current_user = Depends(get_current_user)
):
    """Delete a conversation"""
    try:
        from bson import ObjectId
        conversations_collection: AsyncIOMotorCollection = db.conversations
        result = await conversations_collection.delete_one({
            "_id": ObjectId(conversation_id),
            "user_id": current_user.id
        })

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Conversation not found")

        return {"message": "Conversation deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting conversation: {str(e)}")