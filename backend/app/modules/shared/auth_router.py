from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.core.security import verify_password, create_access_token, decode_access_token, get_password_hash
from app.modules.shared.models import AdminUser, AuditLog
from app.modules.shared.schemas import AdminLogin, Token, AdminUserOut

router = APIRouter(prefix="/api/auth", tags=["Admin Auth"])

async def record_audit(db: AsyncSession, actor_name: str, action: str, target_type: str, target_id: str = None, details: dict = None, ip_address: str = None):
    log = AuditLog(
        actor_name=actor_name,
        action=action,
        target_type=target_type,
        target_id=target_id,
        details=details or {},
        ip_address=ip_address
    )
    db.add(log)
    await db.commit()

@router.post("/login", response_model=Token)
async def login(credentials: AdminLogin, response: Response, request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AdminUser).where(AdminUser.email == credentials.email))
    admin = result.scalars().first()

    # Seed initial superadmin if table empty
    if not admin and credentials.email == "admin@aarambhatravels.in" and credentials.password == "Admin@123":
        admin = AdminUser(
            name="Kushal Parakh",
            email="admin@aarambhatravels.in",
            hashed_password=get_password_hash("Admin@123"),
            is_active=True
        )
        db.add(admin)
        await db.commit()

    if not admin or not verify_password(credentials.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account disabled"
        )

    token = create_access_token(admin.id)

    # Set OWASP-compliant httpOnly cookie
    response.set_cookie(
        key="access_token",
        value=f"Bearer {token}",
        httponly=True,
        max_age=60 * 60 * 24 * 7,
        samesite="lax",
        secure=False  # Set True in production SSL
    )

    await record_audit(
        db=db,
        actor_name=admin.name,
        action="LOGIN_SUCCESS",
        target_type="admin_user",
        target_id=admin.id,
        ip_address=request.client.host if request.client else None
    )

    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=AdminUserOut)
async def get_current_admin(request: Request, db: AsyncSession = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    token = None
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
    else:
        token = request.cookies.get("access_token")
        if token and token.startswith("Bearer "):
            token = token.split(" ")[1]

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    admin_id = payload.get("sub")
    result = await db.execute(select(AdminUser).where(AdminUser.id == admin_id))
    admin = result.scalars().first()

    if not admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return admin
