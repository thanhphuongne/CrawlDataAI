from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class HistoryComment(Base):
    __tablename__ = "history_comments"

    id = Column(Integer, primary_key=True, index=True)
    submit_id = Column(Integer, ForeignKey("submit_requests.id"), nullable=False)
    descriptions = Column(Text, nullable=False)
    comment_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    submit_request = relationship("SubmitRequest", backref="comments")
    commenter = relationship("User", backref="comments")

    def to_dict(self):
        return {
            "id": self.id,
            "submit_id": self.submit_id,
            "descriptions": self.descriptions,
            "comment_by_id": self.comment_by_id,
            "created_at": self.created_at,
        }