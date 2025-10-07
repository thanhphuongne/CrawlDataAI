from sqlalchemy.orm import Session
from ..models import Request, RequestStatus
from typing import Optional

def create_request(db: Session, user_id: int, requirement: str) -> Request:
    """Create a new crawl request"""
    new_request = Request(
        user_id=user_id,
        requirement=requirement,
        status=RequestStatus.pending
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

def update_request_status(db: Session, request_id: int, status: RequestStatus):
    """Update request status"""
    db.query(Request).filter(Request.id == request_id).update({"status": status})
    db.commit()

def get_request(db: Session, request_id: int, user_id: int) -> Optional[Request]:
    """Get a request by ID for a specific user"""
    return db.query(Request).filter(
        Request.id == request_id,
        Request.user_id == user_id
    ).first()

def get_user_requests(db: Session, user_id: int) -> list[Request]:
    """Get all requests for a user"""
    return db.query(Request).filter(Request.user_id == user_id).all()