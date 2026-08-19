from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.session import get_db
from app.modules.fleet.schemas import (
    FleetCategoryCreate, FleetCategoryOut,
    VehicleCreate, VehicleOut,
    FleetInquiryCreate, FleetInquiryOut,
    FleetBookingCreate, FleetBookingOut, FleetHandoverUpdate
)
from app.modules.fleet.service import FleetService

router = APIRouter(prefix="/api/fleet", tags=["Self-Drive Rentals"])

# Categories
@router.post("/categories", response_model=FleetCategoryOut)
async def create_category(payload: FleetCategoryCreate, db: AsyncSession = Depends(get_db)):
    return await FleetService.create_category(payload, db)

@router.get("/categories", response_model=List[FleetCategoryOut])
async def list_categories(db: AsyncSession = Depends(get_db)):
    return await FleetService.list_categories(db)

# Vehicles
@router.post("/vehicles", response_model=VehicleOut)
async def create_vehicle(payload: VehicleCreate, db: AsyncSession = Depends(get_db)):
    return await FleetService.create_vehicle(payload, db)

@router.get("/vehicles", response_model=List[VehicleOut])
async def list_vehicles(db: AsyncSession = Depends(get_db)):
    return await FleetService.list_vehicles(db)

# Inquiries / Lead Funnel
@router.post("/inquiries", response_model=FleetInquiryOut)
async def create_inquiry(payload: FleetInquiryCreate, db: AsyncSession = Depends(get_db)):
    return await FleetService.create_inquiry(payload, db)

@router.get("/inquiries", response_model=List[FleetInquiryOut])
async def list_inquiries(db: AsyncSession = Depends(get_db)):
    return await FleetService.list_inquiries(db)

# Bookings & Status Lifecycle
@router.post("/bookings", response_model=FleetBookingOut)
async def create_booking(payload: FleetBookingCreate, db: AsyncSession = Depends(get_db)):
    return await FleetService.create_booking(payload, db)

@router.get("/bookings", response_model=List[FleetBookingOut])
async def list_bookings(db: AsyncSession = Depends(get_db)):
    return await FleetService.list_bookings(db)

@router.put("/bookings/{booking_id}/pickup", response_model=FleetBookingOut)
async def mark_picked_up(booking_id: str, payload: FleetHandoverUpdate, db: AsyncSession = Depends(get_db)):
    return await FleetService.mark_picked_up(booking_id, payload, db)

@router.put("/bookings/{booking_id}/return", response_model=FleetBookingOut)
async def mark_returned(booking_id: str, db: AsyncSession = Depends(get_db)):
    return await FleetService.mark_returned(booking_id, db)

@router.put("/bookings/{booking_id}/refund", response_model=FleetBookingOut)
async def refund_deposit(booking_id: str, db: AsyncSession = Depends(get_db)):
    return await FleetService.refund_deposit(booking_id, db)
