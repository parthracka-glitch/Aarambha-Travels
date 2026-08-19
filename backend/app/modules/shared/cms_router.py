from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from app.db.session import get_db
from app.modules.shared.models import CMSContent, BlogPost

router = APIRouter(prefix="/api/cms", tags=["CMS & Blogs"])

class BlogPostCreate(BaseModel):
    slug: str
    title: str
    summary: str
    content: str
    cover_image: str = None

class BlogPostOut(BlogPostCreate):
    id: str
    author: str
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/content/{section_key}")
async def get_cms_content(section_key: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(CMSContent).where(CMSContent.section_key == section_key))
    content = res.scalars().first()
    if not content:
        return {"section_key": section_key, "title": "", "content": {}}
    return content

@router.post("/content")
async def update_cms_content(section_key: str, title: str, content: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(CMSContent).where(CMSContent.section_key == section_key))
    item = res.scalars().first()
    if item:
        item.title = title
        item.content = content
    else:
        item = CMSContent(section_key=section_key, title=title, content=content)
        db.add(item)
    await db.commit()
    return {"message": "CMS content saved"}

@router.get("/blogs", response_model=List[BlogPostOut])
async def list_blogs(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(BlogPost).where(BlogPost.is_published == True))
    return res.scalars().all()

@router.post("/blogs", response_model=BlogPostOut)
async def create_blog(payload: BlogPostCreate, db: AsyncSession = Depends(get_db)):
    blog = BlogPost(**payload.model_dump())
    db.add(blog)
    await db.commit()
    await db.refresh(blog)
    return blog
