from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, UserRole
from ..schemas.user import UserUpdate, User
from ..utils.auth import get_password_hash
from ..utils.file_utils import save_upload_file
from .auth import get_current_user

router = APIRouter()

@router.get("/me", response_model=User)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=User)
def update_me(user_update: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    for key, value in user_update.dict(exclude_unset=True).items():
        if key == "password":
            value = get_password_hash(value)
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/", response_model=list[User])
def get_users(skip: int = 0, limit: int = 100, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/supervisors", response_model=list[User])
def get_supervisors(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    supervisors = db.query(User).filter(User.role == UserRole.SUPERVISOR).all()
    return supervisors

@router.post("/upload-avatar")
def upload_avatar(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    file_path = save_upload_file(file)
    return {"filename": file.filename, "path": file_path}