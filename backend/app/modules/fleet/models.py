import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer, JSON, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.db.session import Base

class FleetCustomer(Base):
    __tablename__ = "customers"
    __table_args__ = {"schema": "fleet"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=False)
    license_number = Column(String(50), nullable=True)
    license_document_url = Column(String(500), nullable=True)
    is_license_approved = Column(Boolean, default=True)  # Auto-approved on submission
    created_at = Column(DateTime, default=datetime.utcnow)

    bookings = relationship("FleetBooking", back_populates="customer")

class FleetCategory(Base):
    __tablename__ = "categories"
    __table_args__ = {"schema": "fleet"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(50), nullable=False)  # Hatchback, SUV, Sedan, Bike
    description = Column(Text, nullable=True)

    vehicles = relationship("Vehicle", back_populates="category")

class Vehicle(Base):
    __tablename__ = "vehicles"
    __table_args__ = {"schema": "fleet"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    reg_number = Column(String(30), unique=True, nullable=False)
    category_id = Column(String(36), ForeignKey("fleet.categories.id"), nullable=True)
    vehicle_type = Column(String(20), default="car")  # car or bike
    daily_rate = Column(Float, nullable=False)
    security_deposit = Column(Float, nullable=False)
    status = Column(String(30), default="Available")  # Available, Rented, Maintenance
    images = Column(JSON, default=list)
    specs = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("FleetCategory", back_populates="vehicles")
    bookings = relationship("FleetBooking", back_populates="vehicle")
    reviews = relationship("FleetReview", back_populates="vehicle")

class FleetInquiry(Base):
    __tablename__ = "inquiries"
    __table_args__ = {"schema": "fleet"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_name = Column(String(100), nullable=False)
    customer_email = Column(String(100), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    vehicle_id = Column(String(36), ForeignKey("fleet.vehicles.id"), nullable=True)
    pickup_date = Column(String(50), nullable=True)
    dropoff_date = Column(String(50), nullable=True)
    status = Column(String(30), default="New")  # New, Contacted, Converted, Lost
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class FleetBooking(Base):
    __tablename__ = "bookings"
    __table_args__ = {"schema": "fleet"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_code = Column(String(20), unique=True, nullable=False, index=True)
    vehicle_id = Column(String(36), ForeignKey("fleet.vehicles.id"), nullable=False)
    customer_id = Column(String(36), ForeignKey("fleet.customers.id"), nullable=False)
    pickup_datetime = Column(DateTime, nullable=False)
    dropoff_datetime = Column(DateTime, nullable=False)
    total_rental_amount = Column(Float, nullable=False)
    security_deposit_amount = Column(Float, nullable=False)
    
    # Booking status lifecycle: Deposit Paid -> Picked Up (Paid in Full) -> Returned -> Deposit Refunded
    status = Column(String(40), default="Deposit Paid")
    
    razorpay_deposit_order_id = Column(String(100), nullable=True)
    razorpay_deposit_payment_id = Column(String(100), nullable=True)
    pickup_payment_method = Column(String(30), nullable=True)  # Cash, UPI, Card at counter
    refund_ref = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="bookings")
    customer = relationship("FleetCustomer", back_populates="bookings")
    payments = relationship("FleetPayment", back_populates="booking")

class FleetPayment(Base):
    __tablename__ = "payments"
    __table_args__ = {"schema": "fleet"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = Column(String(36), ForeignKey("fleet.bookings.id"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_type = Column(String(30), nullable=False)  # Security Deposit, Rental Fee, Deposit Refund
    payment_method = Column(String(30), default="Razorpay")  # Razorpay, Cash, UPI, Card
    status = Column(String(30), default="Success")
    transaction_ref = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    booking = relationship("FleetBooking", back_populates="payments")

class FleetReview(Base):
    __tablename__ = "reviews"
    __table_args__ = {"schema": "fleet"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vehicle_id = Column(String(36), ForeignKey("fleet.vehicles.id"), nullable=False)
    customer_name = Column(String(100), nullable=False)
    rating = Column(Integer, nullable=False)  # 1 to 5
    comment = Column(Text, nullable=False)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="reviews")
