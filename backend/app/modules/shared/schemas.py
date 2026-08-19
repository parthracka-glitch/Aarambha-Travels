from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class AdminUserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class AuditLogOut(BaseModel):
    id: str
    actor_name: str
    action: str
    target_type: str
    target_id: Optional[str] = None
    details: Dict[str, Any]
    ip_address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class SettingItem(BaseModel):
    key: str
    value: Any
    category: Optional[str] = "general"

class SettingUpdate(BaseModel):
    settings: Dict[str, Any]

class PromoCodeCreate(BaseModel):
    code: str
    discount_percentage: int
    max_discount_amount: int = 0
    valid_vertical: str  # "tours", "fleet", or "all"

class PromoCodeOut(BaseModel):
    id: str
    code: str
    discount_percentage: int
    max_discount_amount: int
    valid_vertical: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
