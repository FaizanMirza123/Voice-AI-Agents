from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

DB_URL="sqlite+aiosqlite:///./test.db"

engine=create_async_engine(DB_URL, echo=True)
Session_local=sessionmaker(bind=engine,class_=AsyncSession,expire_on_commit=False)

    