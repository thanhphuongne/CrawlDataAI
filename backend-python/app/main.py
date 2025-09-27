from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from .database import get_db, engine, Base
from .routers import auth_router, users_router, categories_router, submit_requests_router
from .config import settings
import uvicorn

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="DSS Backend", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
app.mount("/uploads", StaticFiles(directory=settings.upload_directory), name="uploads")
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(categories_router, prefix="/categories", tags=["categories"])
app.include_router(submit_requests_router, prefix="/submit-request", tags=["submit-request"])

@app.get("/")
def read_root():
    return {"message": "DSS Backend API"}

if __name__ == "__main__":
    uvicorn.run(app, host=settings.host, port=settings.port)