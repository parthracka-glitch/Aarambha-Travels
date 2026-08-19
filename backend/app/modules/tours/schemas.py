from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class TourDestinationCreate(BaseModel):
    name: str
    state: str
    country: str = "India"
    description: Optional[str] = None
    image_url: Optional[str] = None

class TourDestinationOut(TourDestinationCreate):
    id: str

    class Config:
        from_attributes = True

class TourItineraryCreate(BaseModel):
    day_number: int
    title: str
    description: str
    meals: Optional[str] = None
    stay_details: Optional[str] = None

class TourItineraryOut(TourItineraryCreate):
    id: str

    class Config:
        from_attributes = True

class TourPackageCreate(BaseModel):
    slug: str
    title: str
    description: str
    duration_days: int
    duration_nights: int
    base_price: float
    deposit_price: float
    destination_id: Optional[str] = None
    images: List[str] = []
    inclusions: List[str] = []
    itineraries: List[TourItineraryCreate] = []

class TourPackageOut(BaseModel):
    id: str
    slug: str
    title: str
    description: str
    duration_days: int
    duration_nights: int
    base_price: float
    deposit_price: float
    destination_id: Optional[str] = None
    is_active: bool
    images: List[str]
    inclusions: List[str]
    itineraries: List[TourItineraryOut] = []
    created_at: datetime

    class Config:
        from_attributes = True

class TourInquiryCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    package_id: Optional[str] = None
    travel_date: Optional[str] = None
    pax_count: int = 1
    notes: Optional[str] = None

class TourInquiryOut(TourInquiryCreate):
    id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class TourBookingCreate(BaseModel):
    package_id: str
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    travel_date: datetime
    pax_count: int = 1

class TourBookingOut(BaseModel):
    id: str
    booking_code: str
    package_id: str
    customer_id: str
    travel_date: datetime
    pax_count: int
    total_amount: float
    deposit_paid: float
    balance_amount: float
    status: str
    razorpay_order_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TourReviewCreate(BaseModel):
    package_id: str
    customer_name: str
    rating: int
    comment: str

class TourReviewOut(TourReviewCreate):
    id: str
    is_approved: bool
    created_at: datetime

    class Config:
        from_attributes = True
