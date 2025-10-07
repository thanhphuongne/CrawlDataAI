from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

client: AsyncIOMotorClient = None
db = None

async def connect_mongodb():
    global client, db
    try:
        client = AsyncIOMotorClient(settings.mongodb_url)
        db = client.get_database()
        print("Connected to MongoDB successfully")
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        raise

async def close_mongodb():
    if client:
        client.close()