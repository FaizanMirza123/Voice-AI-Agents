from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
Base=declarative_base()
class User(Base):
    __tablename__="users"
    
    id=Column(Integer,primary_key=True, index=True)
    username=Column(String,unique=True, index=True)
    email=Column(String,unique=True,index=True)
    hashed_password=Column(String,index=True)
    oauth=Column(String,nullable=True)