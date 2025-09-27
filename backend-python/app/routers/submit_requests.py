from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import SubmitRequest, User, UserRole, HistoryComment, ProcessStatus
from ..schemas.submit_request import SubmitRequestCreate, SubmitRequestUpdate, SubmitRequest, ApproveRequest, CommentCreate
from .auth import get_current_user

router = APIRouter()

@router.post("/", response_model=SubmitRequest)
def create_submit_request(request: SubmitRequestCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_request = SubmitRequest(**request.dict(), created_by_id=current_user.id)
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@router.put("/", response_model=SubmitRequest)
def update_submit_request(request: SubmitRequestUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Assuming request has id
    db_request = db.query(SubmitRequest).filter(SubmitRequest.id == request.id, SubmitRequest.created_by_id == current_user.id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Request not found")
    for key, value in request.dict(exclude_unset=True).items():
        setattr(db_request, key, value)
    db.commit()
    db.refresh(db_request)
    return db_request

@router.get("/list", response_model=list[SubmitRequest])
def get_submit_requests(skip: int = 0, limit: int = 100, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    requests = db.query(SubmitRequest).offset(skip).limit(limit).all()
    return requests

@router.post("/supervisor-approve")
def supervisor_approve(approve_data: ApproveRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.SUPERVISOR:
        raise HTTPException(status_code=403, detail="Not authorized")
    db_request = db.query(SubmitRequest).filter(SubmitRequest.id == approve_data.id, SubmitRequest.supervisor_id == current_user.id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Request not found")
    db_request.supervisor_approved = approve_data.approve
    if approve_data.approve:
        db_request.status = ProcessStatus.CONFIRMED
    else:
        db_request.status = ProcessStatus.REJECT
    db.commit()
    return {"success": True, "msg": "Approved"}

@router.post("/approver-approve")
def approver_approve(approve_data: ApproveRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_request = db.query(SubmitRequest).filter(SubmitRequest.id == approve_data.id, SubmitRequest.approver == current_user.account_name).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Request not found")
    db_request.approver_approved = approve_data.approve
    if approve_data.approve:
        db_request.status = ProcessStatus.APPROVED
    else:
        db_request.status = ProcessStatus.REJECT
    db.commit()
    return {"success": True, "msg": "Approved"}

@router.post("/comment")
def add_comment(comment: CommentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_comment = HistoryComment(submit_id=comment.submit_id, descriptions=comment.descriptions, comment_by_id=current_user.id)
    db.add(db_comment)
    db.commit()
    return {"success": True}

@router.get("/comment")
def get_comments(submit_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    comments = db.query(HistoryComment).filter(HistoryComment.submit_id == submit_id).all()
    return comments