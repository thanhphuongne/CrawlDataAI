import os
import shutil
from fastapi import UploadFile
from ..config import settings

def save_upload_file(upload_file: UploadFile, destination: str = settings.upload_directory) -> str:
    os.makedirs(destination, exist_ok=True)
    file_path = os.path.join(destination, upload_file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    return file_path