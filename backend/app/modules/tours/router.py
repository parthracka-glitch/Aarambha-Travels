from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.session import get_db
from app.modules.tours.schemas import (
    TourPackageCreate, TourPackageOut,
    TourDestinationCreate, TourDestinationOut,
    TourInquiryCreate, TourInquiryOut,
    TourBookingCreate, TourBookingOut
)
from app.modules.tours.service import ToursService

router = APIRouter(prefix="/api/tours", tags=["Tours & Travels"])

# Destinations
@router.post("/destinations", response_model=TourDestinationOut)
async def create_destination(payload: TourDestinationCreate, db: AsyncSession = Depends(get_db)):
    return await ToursService.create_destination(payload, db)

@router.get("/destinations", response_model=List[TourDestinationOut])
async def list_destinations(db: AsyncSession = Depends(get_db)):
    return await ToursService.list_destinations(db)

# Packages
@router.post("/packages", response_model=TourPackageOut)
async def create_package(payload: TourPackageCreate, db: AsyncSession = Depends(get_db)):
    return await ToursService.create_package(payload, db)

@router.get("/packages", response_model=List[TourPackageOut])
async def list_packages(db: AsyncSession = Depends(get_db)):
    return await ToursService.list_packages(db)

@router.get("/packages/{slug}", response_model=TourPackageOut)
async def get_package_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    return await ToursService.get_package_by_slug(slug, db)

# Inquiries / Lead Funnel
@router.post("/inquiries", response_model=TourInquiryOut)
async def create_inquiry(payload: TourInquiryCreate, db: AsyncSession = Depends(get_db)):
    return await ToursService.create_inquiry(payload, db)

@router.get("/inquiries", response_model=List[TourInquiryOut])
async def list_inquiries(db: AsyncSession = Depends(get_db)):
    return await ToursService.list_inquiries(db)

@router.put("/inquiries/{inquiry_id}/status")
async def update_inquiry_status(inquiry_id: str, new_status: str, db: AsyncSession = Depends(get_db)):
    return await ToursService.update_inquiry_status(inquiry_id, new_status, db)

# Bookings
@router.post("/bookings", response_model=TourBookingOut)
async def create_booking(payload: TourBookingCreate, db: AsyncSession = Depends(get_db)):
    return await ToursService.create_booking(payload, db)

@router.get("/bookings", response_model=List[TourBookingOut])
async def list_bookings(db: AsyncSession = Depends(get_db)):
    return await ToursService.list_bookings(db)
