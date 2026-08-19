import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from app.modules.tours.models import TourPackage, TourDestination, TourInquiry, TourBooking, TourCustomer, TourItinerary
from app.modules.tours.schemas import (
    TourDestinationCreate, TourPackageCreate, TourInquiryCreate, TourBookingCreate
)
from app.modules.shared.auth_router import record_audit

class ToursService:
    @staticmethod
    async def create_destination(payload: TourDestinationCreate, db: AsyncSession):
        dest = TourDestination(**payload.model_dump())
        db.add(dest)
        await db.commit()
        await db.refresh(dest)
        return dest

    @staticmethod
    async def list_destinations(db: AsyncSession):
        res = await db.execute(select(TourDestination))
        return res.scalars().all()

    @staticmethod
    async def create_package(payload: TourPackageCreate, db: AsyncSession):
        itineraries_data = payload.itineraries
        pkg_data = payload.model_dump(exclude={"itineraries"})
        
        pkg = TourPackage(**pkg_data)
        db.add(pkg)
        await db.commit()
        await db.refresh(pkg)

        for itin in itineraries_data:
            it_item = TourItinerary(package_id=pkg.id, **itin.model_dump())
            db.add(it_item)
        
        await db.commit()
        
        res = await db.execute(select(TourPackage).options(selectinload(TourPackage.itineraries)).where(TourPackage.id == pkg.id))
        return res.scalars().first()

    @staticmethod
    async def list_packages(db: AsyncSession):
        res = await db.execute(select(TourPackage).options(selectinload(TourPackage.itineraries)).where(TourPackage.is_active == True))
        return res.scalars().all()

    @staticmethod
    async def get_package_by_slug(slug: str, db: AsyncSession):
        res = await db.execute(select(TourPackage).options(selectinload(TourPackage.itineraries)).where(TourPackage.slug == slug))
        pkg = res.scalars().first()
        if not pkg:
            raise HTTPException(status_code=404, detail="Package not found")
        return pkg

    @staticmethod
    async def create_inquiry(payload: TourInquiryCreate, db: AsyncSession):
        inquiry = TourInquiry(**payload.model_dump(), status="New")
        db.add(inquiry)
        await db.commit()
        await db.refresh(inquiry)
        return inquiry

    @staticmethod
    async def list_inquiries(db: AsyncSession):
        res = await db.execute(select(TourInquiry).order_by(TourInquiry.created_at.desc()))
        return res.scalars().all()

    @staticmethod
    async def update_inquiry_status(inquiry_id: str, new_status: str, db: AsyncSession):
        res = await db.execute(select(TourInquiry).where(TourInquiry.id == inquiry_id))
        inquiry = res.scalars().first()
        if not inquiry:
            raise HTTPException(status_code=404, detail="Inquiry not found")
        inquiry.status = new_status
        await db.commit()
        return {"message": f"Inquiry status updated to {new_status}"}

    @staticmethod
    async def create_booking(payload: TourBookingCreate, db: AsyncSession):
        pkg_res = await db.execute(select(TourPackage).where(TourPackage.id == payload.package_id))
        pkg = pkg_res.scalars().first()
        if not pkg:
            raise HTTPException(status_code=404, detail="Package not found")

        cust_res = await db.execute(select(TourCustomer).where(TourCustomer.email == payload.customer_email))
        customer = cust_res.scalars().first()
        if not customer:
            customer = TourCustomer(
                name=payload.customer_name,
                email=payload.customer_email,
                phone=payload.customer_phone
            )
            db.add(customer)
            await db.commit()
            await db.refresh(customer)

        total = pkg.base_price * payload.pax_count
        deposit = pkg.deposit_price * payload.pax_count
        balance = total - deposit
        booking_code = f"TR-{uuid.uuid4().hex[:6].upper()}"

        booking = TourBooking(
            booking_code=booking_code,
            package_id=pkg.id,
            customer_id=customer.id,
            travel_date=payload.travel_date,
            pax_count=payload.pax_count,
            total_amount=total,
            deposit_paid=deposit,
            balance_amount=balance,
            status="Deposit Paid"
        )
        db.add(booking)
        await db.commit()
        await db.refresh(booking)

        await record_audit(
            db=db,
            actor_name=customer.name,
            action="CREATE_TOURS_BOOKING",
            target_type="tour_booking",
            target_id=booking.id,
            details={"booking_code": booking_code, "deposit": deposit}
        )

        return booking

    @staticmethod
    async def list_bookings(db: AsyncSession):
        res = await db.execute(select(TourBooking).order_by(TourBooking.created_at.desc()))
        return res.scalars().all()
