import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer, JSON, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.db.session import Base

class TourCustomer(Base):
    __tablename__ = "customers"
    __table_args__ = {"schema": "tours"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    bookings = relationship("TourBooking", back_populates="customer")

class TourDestination(Base):
    __tablename__ = "destinations"
    __table_args__ = {"schema": "tours"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    state = Column(String(50), nullable=False)
    country = Column(String(50), default="India")
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)

    packages = relationship("TourPackage", back_populates="destination")

class TourPackage(Base):
    __tablename__ = "packages"
    __table_args__ = {"schema": "tours"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    slug = Column(String(150), unique=True, nullable=False, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    duration_days = Column(Integer, nullable=False)
    duration_nights = Column(Integer, nullable=False)
    base_price = Column(Float, nullable=False)
    deposit_price = Column(Float, nullable=False)
    destination_id = Column(String(36), ForeignKey("tours.destinations.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    images = Column(JSON, default=list)
    inclusions = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    destination = relationship("TourDestination", back_populates="packages")
    itineraries = relationship("TourItinerary", back_populates="package", cascade="all, delete-orphan")
    bookings = relationship("TourBooking", back_populates="package")
    reviews = relationship("TourReview", back_populates="package")

class TourItinerary(Base):
    __tablename__ = "itineraries"
    __table_args__ = {"schema": "tours"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    package_id = Column(String(36), ForeignKey("tours.packages.id"), nullable=False)
    day_number = Column(Integer, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    meals = Column(String(100), nullable=True)
    stay_details = Column(String(200), nullable=True)

    package = relationship("TourPackage", back_populates="itineraries")

class TourInquiry(Base):
    __tablename__ = "inquiries"
    __table_args__ = {"schema": "tours"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_name = Column(String(100), nullable=False)
    customer_email = Column(String(100), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    package_id = Column(String(36), ForeignKey("tours.packages.id"), nullable=True)
    travel_date = Column(String(50), nullable=True)
    pax_count = Column(Integer, default=1)
    status = Column(String(30), default="New")  # New, Contacted, Converted, Lost
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TourBooking(Base):
    __tablename__ = "bookings"
    __table_args__ = {"schema": "tours"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_code = Column(String(20), unique=True, nullable=False, index=True)
    package_id = Column(String(36), ForeignKey("tours.packages.id"), nullable=False)
    customer_id = Column(String(36), ForeignKey("tours.customers.id"), nullable=False)
    travel_date = Column(DateTime, nullable=False)
    pax_count = Column(Integer, default=1)
    total_amount = Column(Float, nullable=False)
    deposit_paid = Column(Float, nullable=False)
    balance_amount = Column(Float, nullable=False)
    status = Column(String(30), default="Pending Deposit")  # Pending Deposit, Deposit Paid, Paid in Full, Cancelled
    razorpay_order_id = Column(String(100), nullable=True)
    razorpay_payment_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    package = relationship("TourPackage", back_populates="bookings")
    customer = relationship("TourCustomer", back_populates="bookings")
    payments = relationship("TourPayment", back_populates="booking")

class TourPayment(Base):
    __tablename__ = "payments"
    __table_args__ = {"schema": "tours"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = Column(String(36), ForeignKey("tours.bookings.id"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_type = Column(String(30), nullable=False)  # Deposit, Balance
    payment_method = Column(String(30), default="Razorpay")  # Razorpay, Cash, UPI
    status = Column(String(30), default="Success")
    transaction_ref = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    booking = relationship("TourBooking", back_populates="payments")

class TourReview(Base):
    __tablename__ = "reviews"
    __table_args__ = {"schema": "tours"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    package_id = Column(String(36), ForeignKey("tours.packages.id"), nullable=False)
    customer_name = Column(String(100), nullable=False)
    rating = Column(Integer, nullable=False)  # 1 to 5
    comment = Column(Text, nullable=False)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    package = relationship("TourPackage", back_populates="reviews")
