from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
from app.db.session import get_db
from app.modules.shared.models import AuditLog
from app.modules.shared.schemas import AuditLogOut

router = APIRouter(prefix="/api/analytics/audit-logs", tags=["Audit Logs"])

@router.get("", response_model=List[AuditLogOut])
async def list_audit_logs(limit: int = 50, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AuditLog).order_by(desc(AuditLog.created_at)).limit(limit))
    return result.scalars().all()
