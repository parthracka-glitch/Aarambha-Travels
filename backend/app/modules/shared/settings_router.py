from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.modules.shared.models import Setting
from app.modules.shared.schemas import SettingUpdate
from app.modules.shared.auth_router import record_audit

router = APIRouter(prefix="/api/settings", tags=["Settings"])

@router.get("")
async def get_settings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Setting))
    settings_list = result.scalars().all()
    
    settings_dict = {s.key: s.value for s in settings_list}
    
    # Defaults if empty
    if "business_name" not in settings_dict:
        settings_dict["business_name"] = "Aarambha Tours & Travels + Self-Drive Rentals"
    if "contact_phone" not in settings_dict:
        settings_dict["contact_phone"] = "+91 98765 43210"
    if "contact_email" not in settings_dict:
        settings_dict["contact_email"] = "info@aarambhatravels.in"

    return settings_dict

@router.post("")
async def update_settings(payload: SettingUpdate, db: AsyncSession = Depends(get_db)):
    for key, value in payload.settings.items():
        result = await db.execute(select(Setting).where(Setting.key == key))
        setting = result.scalars().first()
        if setting:
            setting.value = value
        else:
            new_setting = Setting(key=key, value=value)
            db.add(new_setting)
            
    await db.commit()
    await record_audit(
        db=db,
        actor_name="Admin",
        action="UPDATE_SETTINGS",
        target_type="settings",
        details=payload.settings
    )
    return {"message": "Settings updated successfully"}
