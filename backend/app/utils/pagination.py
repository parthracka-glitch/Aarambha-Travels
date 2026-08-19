from typing import TypeVar, Generic, Sequence
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

T = TypeVar("T")

class PageParams(BaseModel):
    page: int = 1
    size: int = 50

class Page(BaseModel, Generic[T]):
    items: Sequence[T]
    total: int
    page: int
    size: int
    pages: int

async def paginate(db: AsyncSession, query, params: PageParams) -> Page:
    total_res = await db.execute(select(func.count()).select_from(query.subquery()))
    total = total_res.scalar_one()

    offset = (params.page - 1) * params.size
    items_res = await db.execute(query.offset(offset).limit(params.size))
    items = items_res.scalars().all()

    pages = (total + params.size - 1) // params.size if total > 0 else 0

    return Page(
        items=items,
        total=total,
        page=params.page,
        size=params.size,
        pages=pages
    )
