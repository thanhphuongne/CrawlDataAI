from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..mongodb import db
from ..utils.auth import get_current_user
from ..models import Request
import json
from motor.motor_asyncio import AsyncIOMotorCollection
from datetime import datetime

router = APIRouter()

@router.get("/{request_id}")
async def get_crawled_data(
    request_id: int,
    current_user = Depends(get_current_user),
    db_session: Session = Depends(get_db)
):
    """Get crawled data for a specific request"""
    # Check if request belongs to user
    request = db_session.query(Request).filter(
        Request.id == request_id,
        Request.user_id == current_user.id
    ).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    try:
        crawled_data_collection: AsyncIOMotorCollection = db.crawled_data
        cursor = crawled_data_collection.find({"request_id": request_id})
        data = []

        async for document in cursor:
            # Convert ObjectId to string for JSON serialization
            document["_id"] = str(document["_id"])
            data.append(document)

        return {
            "request_id": request_id,
            "status": request.status.value,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving data: {str(e)}")

@router.get("/{request_id}/export")
async def export_crawled_data(
    request_id: int,
    format: str = "json",
    current_user = Depends(get_current_user),
    db_session: Session = Depends(get_db)
):
    """Export crawled data in different formats"""
    # Check if request belongs to user and is completed
    request = db_session.query(Request).filter(
        Request.id == request_id,
        Request.user_id == current_user.id,
        Request.status == "completed"
    ).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found or not completed")

    try:
        crawled_data_collection: AsyncIOMotorCollection = db.crawled_data
        cursor = crawled_data_collection.find({"request_id": request_id})
        data = []

        async for document in cursor:
            document["_id"] = str(document["_id"])
            data.append(document)

        if format == "json":
            return {
                "request_id": request_id,
                "requirement": request.requirement,
                "exported_at": str(datetime.utcnow()),
                "data": data
            }
        else:
            # For now, just return JSON. Could add CSV/XLSX export later
            raise HTTPException(status_code=400, detail="Unsupported export format")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting data: {str(e)}")