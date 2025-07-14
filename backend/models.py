from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from datetime import datetime

Base = declarative_base()

# Database setup
DB_URL = "sqlite+aiosqlite:///./test.db"
engine = create_async_engine(DB_URL, echo=True)
Session_local = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with Session_local() as session:
        yield session

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String, index=True)
    
    # Relationship to user assistants
    assistants = relationship("UserAssistant", back_populates="user")

class UserAssistant(Base):
    __tablename__ = "user_assistants"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assistant_id = Column(String, nullable=False)  # VAPI assistant ID
    assistant_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to user
    user = relationship("User", back_populates="assistants")
