from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class FleetCategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

class FleetCategoryOut(FleetCategoryCreate):
    id: str

    class Config:
        from_attributes = True

class VehicleCreate(BaseModel):
    name: str
    reg_number: str
    category_id: Optional[str] = None
    vehicle_type: str = "car"  # car or bike
    daily_rate: float
    security_deposit: float
    images: List[str] = []
    specs: Dict[str, Any] = {}

class VehicleOut(VehicleCreate):
    id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class FleetInquiryCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    vehicle_id: Optional[str] = None
    pickup_date: Optional[str] = None
    dropoff_date: Optional[str] = None
    notes: Optional[str] = None

class FleetInquiryOut(FleetInquiryCreate):
    id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class FleetBookingCreate(BaseModel):
    vehicle_id: str
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    license_number: str
    license_document_url: Optional[str] = None
    pickup_datetime: datetime
    dropoff_datetime: datetime

class FleetBookingOut(BaseModel):
    id: str
    booking_code: str
    vehicle_id: str
    customer_id: str
    pickup_datetime: datetime
    dropoff_datetime: datetime
    total_rental_amount: float
    security_deposit_amount: float
    status: str
    pickup_payment_method: Optional[str] = None
    refund_ref: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class FleetHandoverUpdate(BaseModel):
    pickup_payment_method: str  # Cash, UPI, Card
    license_visually_verified: bool = True
