from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base
import enum

class ProcessStatus(str, enum.Enum):
    WAITING = "WAITING"
    CONFIRMED = "CONFIRMED"
    APPROVED = "APPROVED"
    CANCEL = "CANCEL"
    REJECT = "REJECT"

class SubmitRequest(Base):
    __tablename__ = "submit_requests"

    id = Column(Integer, primary_key=True, index=True)
    account_name = Column(String, nullable=False)
    descriptions = Column(Text, nullable=False)
    supervisor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    approver = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    has_notify_mail = Column(Boolean, default=False)
    supervisor_approved = Column(Boolean, default=False)
    approver_approved = Column(Boolean, default=False)
    status = Column(Enum(ProcessStatus), default=ProcessStatus.WAITING)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    supervisor = relationship("User", foreign_keys=[supervisor_id], backref="supervised_requests")
    created_by = relationship("User", foreign_keys=[created_by_id], backref="created_requests")
    category = relationship("Category", backref="submit_requests")

    def to_dict(self):
        return {
            "id": self.id,
            "account_name": self.account_name,
            "descriptions": self.descriptions,
            "supervisor_id": self.supervisor_id,
            "approver": self.approver,
            "category_id": self.category_id,
            "has_notify_mail": self.has_notify_mail,
            "supervisor_approved": self.supervisor_approved,
            "approver_approved": self.approver_approved,
            "status": self.status,
            "created_by_id": self.created_by_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }