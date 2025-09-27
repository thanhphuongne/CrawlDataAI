from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://user:password@localhost/dbname"

    # JWT
    secret_key: str = "your-secret-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 14400  # 10 days

    # Email
    sendgrid_api_key: Optional[str] = None
    email_from: str = "noreply@example.com"

    # File uploads
    upload_directory: str = "uploads"
    max_upload_size: int = 25 * 1024 * 1024  # 25MB

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # Other
    bcrypt_rounds: int = 12
    default_language: str = "vi"

    class Config:
        env_file = ".env"

settings = Settings()