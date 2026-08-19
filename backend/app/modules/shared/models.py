import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

class AdminUser(Base):
    __tablename__ = "admin_users"
    __table_args__ = {"schema": "shared"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role_id = Column(String(36), ForeignKey("shared.roles.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    role = relationship("Role", back_populates="users")

class Role(Base):
    __tablename__ = "roles"
    __table_args__ = {"schema": "shared"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(255), nullable=True)
    permissions = Column(JSON, default=list)  # e.g., ["read_tours", "write_tours", "manage_finance"]

    users = relationship("AdminUser", back_populates="role")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    __table_args__ = {"schema": "shared"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    actor_id = Column(String(36), nullable=True)
    actor_name = Column(String(100), nullable=False, default="System")
    action = Column(String(100), nullable=False)
    target_type = Column(String(50), nullable=False)
    target_id = Column(String(36), nullable=True)
    details = Column(JSON, default=dict)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Setting(Base):
    __tablename__ = "settings"
    __table_args__ = {"schema": "shared"}

    key = Column(String(100), primary_key=True)
    value = Column(JSON, nullable=False)
    category = Column(String(50), default="general")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CMSContent(Base):
    __tablename__ = "cms_content"
    __table_args__ = {"schema": "shared"}

    section_key = Column(String(100), primary_key=True)
    title = Column(String(255), nullable=False)
    content = Column(JSON, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class BlogPost(Base):
    __tablename__ = "blogs"
    __table_args__ = {"schema": "shared"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    slug = Column(String(150), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    cover_image = Column(String(500), nullable=True)
    author = Column(String(100), default="Aarambha Team")
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class PromoCode(Base):
    __tablename__ = "promo_codes"
    __table_args__ = {"schema": "shared"}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(30), unique=True, nullable=False, index=True)
    discount_percentage = Column(Integer, nullable=False)
    max_discount_amount = Column(Integer, default=0)
    valid_vertical = Column(String(20), nullable=False)  # "tours", "fleet", or "all"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
