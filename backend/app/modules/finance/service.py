from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.modules.shared.models import PromoCode
from app.modules.shared.schemas import PromoCodeCreate

class FinanceService:
    @staticmethod
    async def create_promo_code(payload: PromoCodeCreate, db: AsyncSession):
        if payload.valid_vertical not in ["tours", "fleet", "all"]:
            raise HTTPException(status_code=400, detail="valid_vertical must be 'tours', 'fleet', or 'all'")
        
        code_obj = PromoCode(**payload.model_dump())
        db.add(code_obj)
        await db.commit()
        await db.refresh(code_obj)
        return code_obj

    @staticmethod
    async def list_promo_codes(db: AsyncSession):
        res = await db.execute(select(PromoCode))
        return res.scalars().all()

    @staticmethod
    async def validate_promo_code(code: str, vertical: str, db: AsyncSession):
        res = await db.execute(select(PromoCode).where(PromoCode.code == code, PromoCode.is_active == True))
        promo = res.scalars().first()

        if not promo:
            raise HTTPException(status_code=404, detail="Invalid or expired promo code")

        if promo.valid_vertical != "all" and promo.valid_vertical != vertical:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Promo code '{code}' is valid for {promo.valid_vertical.upper()} only and cannot be applied to {vertical.upper()}!"
            )

        return {
            "valid": True,
            "code": promo.code,
            "discount_percentage": promo.discount_percentage,
            "max_discount_amount": promo.max_discount_amount,
            "valid_vertical": promo.valid_vertical
        }
