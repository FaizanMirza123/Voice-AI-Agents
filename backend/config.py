from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

DB_URL="sqlite+aiosqlite:///./test.db"
API_Key= "2a94228d-fa25-47b1-95f4-96dc2039f8c7"

engine=create_async_engine(DB_URL, echo=True)
Session_local=sessionmaker(bind=engine,class_=AsyncSession,expire_on_commit=False)