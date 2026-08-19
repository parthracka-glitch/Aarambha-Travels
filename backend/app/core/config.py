import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Aarambha API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://aarambha_user:aarambha_password@localhost:5432/aarambha_db"
    )

    # JWT Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "aarambha-super-secret-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Dual Razorpay Configuration
    RAZORPAY_TOURS_KEY_ID: Optional[str] = os.getenv("RAZORPAY_TOURS_KEY_ID", "rzp_test_tours_key")
    RAZORPAY_TOURS_KEY_SECRET: Optional[str] = os.getenv("RAZORPAY_TOURS_KEY_SECRET", "rzp_test_tours_secret")
    
    RAZORPAY_FLEET_KEY_ID: Optional[str] = os.getenv("RAZORPAY_FLEET_KEY_ID", "rzp_test_fleet_key")
    RAZORPAY_FLEET_KEY_SECRET: Optional[str] = os.getenv("RAZORPAY_FLEET_KEY_SECRET", "rzp_test_fleet_secret")

    # Email Config
    RESEND_API_KEY: Optional[str] = os.getenv("RESEND_API_KEY", "")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "noreply@aarambhatravels.in")

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    class Config:
        case_sensitive = True

settings = Settings()
