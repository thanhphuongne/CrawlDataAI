from ..mongodb import db
from motor.motor_asyncio import AsyncIOMotorCollection
from typing import Optional, List, Dict
from datetime import datetime

async def get_or_create_general_conversation(user_id: int) -> Dict:
    """Get or create the general conversation for a user"""
    try:
        conversations_collection: AsyncIOMotorCollection = db.conversations

        # Try to find existing general conversation
        conversation = await conversations_collection.find_one({
            "user_id": user_id,
            "request_id": None
        })

        if conversation:
            conversation["_id"] = str(conversation["_id"])
            return conversation

        # Create new general conversation
        new_conversation = {
            "user_id": user_id,
            "request_id": None,
            "messages": [],
            "created_at": datetime.utcnow()
        }

        result = await conversations_collection.insert_one(new_conversation)
        new_conversation["_id"] = str(result.inserted_id)

        return new_conversation
    except Exception as e:
        print(f"Error getting/creating conversation: {e}")
        raise

async def send_message_to_general_conversation(user_id: int, content: str, role: str):
    """Send a message to the user's general conversation"""
    try:
        conversations_collection: AsyncIOMotorCollection = db.conversations

        # Find general conversation
        conversation = await conversations_collection.find_one({
            "user_id": user_id,
            "request_id": None
        })

        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow()
        }

        if conversation:
            # Update existing conversation
            await conversations_collection.update_one(
                {"_id": conversation["_id"]},
                {"$push": {"messages": message}}
            )
        else:
            # Create new conversation
            new_conversation = {
                "user_id": user_id,
                "request_id": None,
                "messages": [message],
                "created_at": datetime.utcnow()
            }
            await conversations_collection.insert_one(new_conversation)
    except Exception as e:
        print(f"Error sending message to conversation: {e}")
        raise

async def get_conversation_messages(user_id: int, conversation_id: Optional[str] = None) -> List[Dict]:
    """Get messages from a conversation"""
    try:
        conversations_collection: AsyncIOMotorCollection = db.conversations

        if conversation_id:
            from bson import ObjectId
            conversation = await conversations_collection.find_one({
                "_id": ObjectId(conversation_id),
                "user_id": user_id
            })
            return conversation.get("messages", []) if conversation else []
        else:
            # Get general conversation
            conversation = await conversations_collection.find_one({
                "user_id": user_id,
                "request_id": None
            })
            return conversation.get("messages", []) if conversation else []
    except Exception as e:
        print(f"Error getting conversation messages: {e}")
        return []