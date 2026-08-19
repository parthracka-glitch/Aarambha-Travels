import asyncio
from sqlalchemy import text
from app.db.session import engine, Base

async def init_db():
    async with engine.begin() as conn:
        # Create schemas if they do not exist
        await conn.execute(text("CREATE SCHEMA IF NOT EXISTS shared;"))
        await conn.execute(text("CREATE SCHEMA IF NOT EXISTS tours;"))
        await conn.execute(text("CREATE SCHEMA IF NOT EXISTS fleet;"))
        
        # Create tables
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(init_db())
