from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .user import User
from .category import Category
from ..models import ProcessStatus

class SubmitRequestBase(BaseModel):
    account_name: str
    descriptions: str
    supervisor_id: int
    approver: str
    category_id: int
    has_notify_mail: bool = False

class SubmitRequestCreate(SubmitRequestBase):
    pass

class SubmitRequestUpdate(BaseModel):
    id: int
    account_name: Optional[str] = None
    descriptions: Optional[str] = None
    supervisor_id: Optional[int] = None
    category_id: Optional[int] = None
    has_notify_mail: Optional[bool] = None

class SubmitRequest(SubmitRequestBase):
    id: int
    supervisor_approved: bool = False
    approver_approved: bool = False
    status: ProcessStatus = ProcessStatus.WAITING
    created_by_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    supervisor: Optional[User]
    created_by: Optional[User]
    category: Optional[Category]

    class Config:
        from_attributes = True

class ApproveRequest(BaseModel):
    id: int
    approve: bool
    descriptions: Optional[str] = None

class CommentCreate(BaseModel):
    submit_id: int
    descriptions: str