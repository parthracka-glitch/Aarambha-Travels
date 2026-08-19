import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.modules.fleet.models import Vehicle, FleetCategory, FleetInquiry, FleetBooking, FleetCustomer, FleetPayment
from app.modules.fleet.schemas import (
    FleetCategoryCreate, VehicleCreate, FleetInquiryCreate, FleetBookingCreate, FleetHandoverUpdate
)
from app.modules.shared.auth_router import record_audit

class FleetService:
    @staticmethod
    async def create_category(payload: FleetCategoryCreate, db: AsyncSession):
        cat = FleetCategory(**payload.model_dump())
        db.add(cat)
        await db.commit()
        await db.refresh(cat)
        return cat

    @staticmethod
    async def list_categories(db: AsyncSession):
        res = await db.execute(select(FleetCategory))
        return res.scalars().all()

    @staticmethod
    async def create_vehicle(payload: VehicleCreate, db: AsyncSession):
        veh = Vehicle(**payload.model_dump(), status="Available")
        db.add(veh)
        await db.commit()
        await db.refresh(veh)
        return veh

    @staticmethod
    async def list_vehicles(db: AsyncSession):
        res = await db.execute(select(Vehicle))
        return res.scalars().all()

    @staticmethod
    async def create_inquiry(payload: FleetInquiryCreate, db: AsyncSession):
        inquiry = FleetInquiry(**payload.model_dump(), status="New")
        db.add(inquiry)
        await db.commit()
        await db.refresh(inquiry)
        return inquiry

    @staticmethod
    async def list_inquiries(db: AsyncSession):
        res = await db.execute(select(FleetInquiry).order_by(FleetInquiry.created_at.desc()))
        return res.scalars().all()

    @staticmethod
    async def create_booking(payload: FleetBookingCreate, db: AsyncSession):
        veh_res = await db.execute(select(Vehicle).where(Vehicle.id == payload.vehicle_id))
        veh = veh_res.scalars().first()
        if not veh:
            raise HTTPException(status_code=404, detail="Vehicle not found")

        cust_res = await db.execute(select(FleetCustomer).where(FleetCustomer.email == payload.customer_email))
        customer = cust_res.scalars().first()
        if not customer:
            customer = FleetCustomer(
                name=payload.customer_name,
                email=payload.customer_email,
                phone=payload.customer_phone,
                license_number=payload.license_number,
                license_document_url=payload.license_document_url,
                is_license_approved=True
            )
            db.add(customer)
            await db.commit()
            await db.refresh(customer)

        days = max(1, (payload.dropoff_datetime - payload.pickup_datetime).days)
        total_rental = veh.daily_rate * days
        security_deposit = veh.security_deposit
        booking_code = f"FL-{uuid.uuid4().hex[:6].upper()}"

        booking = FleetBooking(
            booking_code=booking_code,
            vehicle_id=veh.id,
            customer_id=customer.id,
            pickup_datetime=payload.pickup_datetime,
            dropoff_datetime=payload.dropoff_datetime,
            total_rental_amount=total_rental,
            security_deposit_amount=security_deposit,
            status="Deposit Paid"
        )
        db.add(booking)
        await db.commit()
        await db.refresh(booking)

        await record_audit(
            db=db,
            actor_name=customer.name,
            action="CREATE_FLEET_BOOKING",
            target_type="fleet_booking",
            target_id=booking.id,
            details={"booking_code": booking_code, "deposit": security_deposit}
        )

        return booking

    @staticmethod
    async def list_bookings(db: AsyncSession):
        res = await db.execute(select(FleetBooking).order_by(FleetBooking.created_at.desc()))
        return res.scalars().all()

    @staticmethod
    async def mark_picked_up(booking_id: str, payload: FleetHandoverUpdate, db: AsyncSession):
        res = await db.execute(select(FleetBooking).where(FleetBooking.id == booking_id))
        booking = res.scalars().first()
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")

        booking.status = "Picked Up (Paid in Full)"
        booking.pickup_payment_method = payload.pickup_payment_method

        veh_res = await db.execute(select(Vehicle).where(Vehicle.id == booking.vehicle_id))
        veh = veh_res.scalars().first()
        if veh:
            veh.status = "Rented"

        payment = FleetPayment(
            booking_id=booking.id,
            amount=booking.total_rental_amount,
            payment_type="Rental Fee",
            payment_method=payload.pickup_payment_method,
            status="Success"
        )
        db.add(payment)
        await db.commit()
        await db.refresh(booking)

        await record_audit(
            db=db,
            actor_name="Staff Admin",
            action="FLEET_HANDOVER_PICKUP",
            target_type="fleet_booking",
            target_id=booking.id,
            details={"payment_method": payload.pickup_payment_method, "license_verified": payload.license_visually_verified}
        )

        return booking

    @staticmethod
    async def mark_returned(booking_id: str, db: AsyncSession):
        res = await db.execute(select(FleetBooking).where(FleetBooking.id == booking_id))
        booking = res.scalars().first()
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")

        booking.status = "Returned"

        veh_res = await db.execute(select(Vehicle).where(Vehicle.id == booking.vehicle_id))
        veh = veh_res.scalars().first()
        if veh:
            veh.status = "Available"

        await db.commit()
        await db.refresh(booking)
        return booking

    @staticmethod
    async def refund_deposit(booking_id: str, db: AsyncSession):
        res = await db.execute(select(FleetBooking).where(FleetBooking.id == booking_id))
        booking = res.scalars().first()
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")

        refund_ref = f"RF-{uuid.uuid4().hex[:8].upper()}"
        booking.status = "Deposit Refunded"
        booking.refund_ref = refund_ref

        payment = FleetPayment(
            booking_id=booking.id,
            amount=booking.security_deposit_amount,
            payment_type="Deposit Refund",
            payment_method="Razorpay Refund API",
            status="Success",
            transaction_ref=refund_ref
        )
        db.add(payment)
        await db.commit()
        await db.refresh(booking)

        await record_audit(
            db=db,
            actor_name="Super Admin",
            action="FLEET_DEPOSIT_REFUND",
            target_type="fleet_booking",
            target_id=booking.id,
            details={"refund_ref": refund_ref, "amount": booking.security_deposit_amount}
        )

        return booking
