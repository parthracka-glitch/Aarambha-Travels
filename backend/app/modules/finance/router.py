from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.session import get_db
from app.modules.shared.schemas import PromoCodeCreate, PromoCodeOut
from app.modules.finance.service import FinanceService

router = APIRouter(prefix="/api/finance", tags=["Finance & Promo Codes"])

@router.post("/promo-codes", response_model=PromoCodeOut)
async def create_promo_code(payload: PromoCodeCreate, db: AsyncSession = Depends(get_db)):
    return await FinanceService.create_promo_code(payload, db)

@router.get("/promo-codes", response_model=List[PromoCodeOut])
async def list_promo_codes(db: AsyncSession = Depends(get_db)):
    return await FinanceService.list_promo_codes(db)

@router.post("/promo-codes/validate")
async def validate_promo_code(code: str, vertical: str, db: AsyncSession = Depends(get_db)):
    return await FinanceService.validate_promo_code(code, vertical, db)
