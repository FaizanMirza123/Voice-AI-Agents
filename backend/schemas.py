"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# User schemas
class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    confirm_password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str

# Assistant schemas
class AssistantBase(BaseModel):
    name: str
    prompt: str
    voiceId: Optional[str] = None
    firstMessage: Optional[str] = None
    
class AssistantCreate(AssistantBase):
    pass

class AssistantUpdate(BaseModel):
    name: Optional[str] = None
    prompt: Optional[str] = None
    voiceId: Optional[str] = None
    firstMessage: Optional[str] = None

class AssistantResponse(BaseModel):
    id: str
    name: str
    prompt: Optional[str] = None
    voiceId: Optional[str] = None
    firstMessage: Optional[str] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

# Phone number schemas
class PhoneNumberBase(BaseModel):
    provider: str = "byo-phone-number"
    number: str
    credentialId: Optional[str] = None

class PhoneNumberCreate(PhoneNumberBase):
    pass

class PhoneNumberUpdate(BaseModel):
    number: Optional[str] = None
    credentialId: Optional[str] = None

class PhoneNumberResponse(BaseModel):
    id: str
    provider: str
    number: str
    credentialId: Optional[str] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

# Message schemas
class MessageResponse(BaseModel):
    role: str
    content: str
    time: Optional[float] = None

class CallLogResponse(BaseModel):
    assistantId: str
    assistantName: str
    messages: List[MessageResponse]
    createdAt: Optional[str] = None
    duration: Optional[float] = None

# Generic response schemas
class SuccessResponse(BaseModel):
    message: str
    data: Optional[Dict[str, Any]] = None

class ErrorResponse(BaseModel):
    detail: str
    code: Optional[int] = None
