from fastapi import FastAPI, Request, HTTPException
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
import requests
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, time@app.post("/phone-numbers", response_model=PhoneNumberResponse)
async def create_phone_number(phone_data: PhoneNumberCreate, user=Depends(verify_jwt), db:AsyncSession=Depends(get_db)):
    """Create new phone number and associate it with user's assistant"""
    try:
        # Verify the assistant belongs to the user
        assistant_id = phone_data.assistant_id
        if assistant_id:
            result = await db.execute(
                select(UserAssistant).where(
                    UserAssistant.user_id == user.id,
                    UserAssistant.assistant_id == assistant_id
                )
            )
            user_assistant = result.scalar_one_or_none()
            
            if not user_assistant:
                raise HTTPException(status_code=404, detail="Assistant not found or access denied")
        
        phone_number = vapi_service.create_phone_number(phone_data.dict())
        return phone_number
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/phone-numbers/{phone_id}", response_model=PhoneNumberResponse)
async def update_phone_number(phone_id: str, phone_data: PhoneNumberUpdate, user=Depends(verify_jwt), db:AsyncSession=Depends(get_db)):
    """Update phone number if it belongs to user's assistant"""
    try:
        # Get the phone number first
        phone_number = vapi_service.get_phone_number(phone_id)
        assistant_id = phone_number.get("assistantId")
        
        # Verify the assistant belongs to the user
        if assistant_id:
            result = await db.execute(
                select(UserAssistant).where(
                    UserAssistant.user_id == user.id,
                    UserAssistant.assistant_id == assistant_id
                )
            )
            user_assistant = result.scalar_one_or_none()
            
            if not user_assistant:
                raise HTTPException(status_code=404, detail="Phone number not found or access denied")
        
        # If updating assistant, verify new assistant also belongs to user
        update_data = {k: v for k, v in phone_data.dict().items() if v is not None}
        new_assistant_id = update_data.get("assistant_id")
        if new_assistant_id and new_assistant_id != assistant_id:
            result = await db.execute(
                select(UserAssistant).where(
                    UserAssistant.user_id == user.id,
                    UserAssistant.assistant_id == new_assistant_id
                )
            )
            user_assistant = result.scalar_one_or_none()
            
            if not user_assistant:
                raise HTTPException(status_code=404, detail="New assistant not found or access denied")
        
        phone_number = vapi_service.update_phone_number(phone_id, update_data)
        return phone_number
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))rom fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi import Depends,HTTPException,status
from config import Session_local, API_Key
from models import User, UserAssistant
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
import asyncio
from models import Base
from config import engine
from services import vapi_service
from schemas import *
from typing import List

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Assisstant ID: 7b1234fd-957e-4621-a3a8-da311fd936e2
security=HTTPBearer()

SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256" 

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def get_db():
    async with Session_local() as session:
        yield session
@app.on_event("startup")
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def verify_jwt(credentials:HTTPAuthorizationCredentials = Depends(security) , db:AsyncSession=Depends(get_db)):
    token= credentials.credentials
    try:
        payload=jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        result=await db.execute(select(User).where(User.email==email))
        user = result.scalar_one_or_none()
        
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user  # Return user object instead of payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401,detail="Invalid token")
    
def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta=None):
    to_encode = data.copy()
    if expires_delta is None:
        expires_delta = timedelta(minutes=15)
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.get("/protected")
async def protected_route(user=Depends(verify_jwt)):
    return {"message": "You are authenticated", "user": {"id": user.id, "email": user.email}}

# ============= ASSISTANT MANAGEMENT ENDPOINTS =============

@app.get("/assistants", response_model=List[AssistantResponse])
async def get_assistants(user=Depends(verify_jwt), db:AsyncSession=Depends(get_db)):
    """Get all assistants for the authenticated user"""
    try:
        # Get user's assistant IDs from database
        result = await db.execute(select(UserAssistant).where(UserAssistant.user_id == user.id))
        user_assistants = result.scalars().all()
        
        if not user_assistants:
            return []
        
        # Get full assistant details from VAPI
        assistants = []
        for ua in user_assistants:
            try:
                assistant = vapi_service.get_assistant(ua.assistant_id)
                assistants.append(assistant)
            except Exception as e:
                # Assistant might be deleted from VAPI, remove from our DB
                await db.delete(ua)
                continue
        
        await db.commit()
        return assistants
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/assistants/{assistant_id}", response_model=AssistantResponse)
async def get_assistant(assistant_id: str, user=Depends(verify_jwt), db:AsyncSession=Depends(get_db)):
    """Get specific assistant by ID if user owns it"""
    try:
        # Check if user owns this assistant
        result = await db.execute(
            select(UserAssistant).where(
                UserAssistant.user_id == user.id,
                UserAssistant.assistant_id == assistant_id
            )
        )
        user_assistant = result.scalar_one_or_none()
        
        if not user_assistant:
            raise HTTPException(status_code=404, detail="Assistant not found or access denied")
        
        assistant = vapi_service.get_assistant(assistant_id)
        return assistant
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/assistants", response_model=AssistantResponse)
async def create_assistant(assistant_data: AssistantCreate, user=Depends(verify_jwt), db:AsyncSession=Depends(get_db)):
    """Create new assistant and associate with user"""
    try:
        # Create assistant in VAPI
        assistant = vapi_service.create_assistant(assistant_data.dict())
        
        # Store user-assistant association in database
        user_assistant = UserAssistant(
            user_id=user.id,
            assistant_id=assistant["id"],
            assistant_name=assistant["name"]
        )
        db.add(user_assistant)
        await db.commit()
        
        return assistant
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/assistants/{assistant_id}", response_model=AssistantResponse)
async def update_assistant(assistant_id: str, assistant_data: AssistantUpdate, user=Depends(verify_jwt), db:AsyncSession=Depends(get_db)):
    """Update assistant if user owns it"""
    try:
        # Check if user owns this assistant
        result = await db.execute(
            select(UserAssistant).where(
                UserAssistant.user_id == user.id,
                UserAssistant.assistant_id == assistant_id
            )
        )
        user_assistant = result.scalar_one_or_none()
        
        if not user_assistant:
            raise HTTPException(status_code=404, detail="Assistant not found or access denied")
        
        # Only send non-None values
        update_data = {k: v for k, v in assistant_data.dict().items() if v is not None}
        assistant = vapi_service.update_assistant(assistant_id, update_data)
        
        # Update name in our database if it changed
        if "name" in update_data:
            user_assistant.assistant_name = update_data["name"]
            await db.commit()
        
        return assistant
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/assistants/{assistant_id}")
async def delete_assistant(assistant_id: str, user=Depends(verify_jwt), db:AsyncSession=Depends(get_db)):
    """Delete assistant if user owns it"""
    try:
        # Check if user owns this assistant
        result = await db.execute(
            select(UserAssistant).where(
                UserAssistant.user_id == user.id,
                UserAssistant.assistant_id == assistant_id
            )
        )
        user_assistant = result.scalar_one_or_none()
        
        if not user_assistant:
            raise HTTPException(status_code=404, detail="Assistant not found or access denied")
        
        # Delete from VAPI
        vapi_service.delete_assistant(assistant_id)
        
        # Delete from our database
        await db.delete(user_assistant)
        await db.commit()
        
        return {"message": "Assistant deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============= PHONE NUMBER MANAGEMENT ENDPOINTS =============

@app.get("/phone-numbers", response_model=List[PhoneNumberResponse])
async def get_phone_numbers(user=Depends(verify_jwt), db:AsyncSession=Depends(get_db)):
    """Get phone numbers for user's assistants"""
    try:
        # Get user's assistant IDs from database
        result = await db.execute(select(UserAssistant).where(UserAssistant.user_id == user.id))
        user_assistants = result.scalars().all()
        user_assistant_ids = set(ua.assistant_id for ua in user_assistants)
        
        # Get all phone numbers
        all_phone_numbers = vapi_service.get_phone_numbers()
        
        # Filter phone numbers for user's assistants
        user_phone_numbers = [
            pn for pn in all_phone_numbers 
            if pn.get("assistantId") in user_assistant_ids
        ]
        
        return user_phone_numbers
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/phone-numbers/{phone_id}", response_model=PhoneNumberResponse)
async def get_phone_number(phone_id: str, user=Depends(verify_jwt), db:AsyncSession=Depends(get_db)):
    """Get specific phone number by ID if it belongs to user's assistant"""
    try:
        # Get the phone number first
        phone_number = vapi_service.get_phone_number(phone_id)
        assistant_id = phone_number.get("assistantId")
        
        # Verify the assistant belongs to the user
        if assistant_id:
            result = await db.execute(
                select(UserAssistant).where(
                    UserAssistant.user_id == user.id,
                    UserAssistant.assistant_id == assistant_id
                )
            )
            user_assistant = result.scalar_one_or_none()
            
            if not user_assistant:
                raise HTTPException(status_code=404, detail="Phone number not found or access denied")
        
        return phone_number
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/phone-numbers", response_model=PhoneNumberResponse)
async def create_phone_number(phone_data: PhoneNumberCreate, user=Depends(verify_jwt)):
    """Create new phone number"""
    try:
        phone_number = vapi_service.create_phone_number(phone_data.dict())
        return phone_number
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/phone-numbers/{phone_id}", response_model=PhoneNumberResponse)
async def update_phone_number(phone_id: str, phone_data: PhoneNumberUpdate, user=Depends(verify_jwt)):
    """Update phone number"""
    try:
        update_data = {k: v for k, v in phone_data.dict().items() if v is not None}
        phone_number = vapi_service.update_phone_number(phone_id, update_data)
        return phone_number
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/phone-numbers/{phone_id}")
async def delete_phone_number(phone_id: str, user=Depends(verify_jwt), db:AsyncSession=Depends(get_db)):
    """Delete phone number if it belongs to user's assistant"""
    try:
        # Get the phone number first
        phone_number = vapi_service.get_phone_number(phone_id)
        assistant_id = phone_number.get("assistantId")
        
        # Verify the assistant belongs to the user
        if assistant_id:
            result = await db.execute(
                select(UserAssistant).where(
                    UserAssistant.user_id == user.id,
                    UserAssistant.assistant_id == assistant_id
                )
            )
            user_assistant = result.scalar_one_or_none()
            
            if not user_assistant:
                raise HTTPException(status_code=404, detail="Phone number not found or access denied")
        
        vapi_service.delete_phone_number(phone_id)
        return {"message": "Phone number deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/messages")
async def get_messages(user=Depends(verify_jwt), db:AsyncSession=Depends(get_db)):
    """Get call logs organized by assistant for the authenticated user"""
    try:
        # Get user's assistant IDs from database
        result = await db.execute(select(UserAssistant).where(UserAssistant.user_id == user.id))
        user_assistants = result.scalars().all()
        
        if not user_assistants:
            return {}
        
        # Create mapping of assistant ID to name
        assistant_id_to_name = {ua.assistant_id: ua.assistant_name for ua in user_assistants}
        user_assistant_ids = set(ua.assistant_id for ua in user_assistants)
        
        # Get calls from VAPI
        calls = vapi_service.get_calls()
        messages_by_assistant = {}
        
        for call in calls:
            assistant_id = call.get("assistantId")
            
            # Only include calls for user's assistants
            if assistant_id not in user_assistant_ids:
                continue
                
            name = assistant_id_to_name.get(assistant_id, "Unknown Assistant")
            chat = call.get("messages", [])
            
            if name not in messages_by_assistant:
                messages_by_assistant[name] = []
            
            messages_by_assistant[name].append(chat)
        
        return messages_by_assistant
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/calls")
async def get_calls(user=Depends(verify_jwt), db:AsyncSession=Depends(get_db)):
    """Get all calls with detailed information for user's assistants"""
    try:
        # Get user's assistant IDs from database
        result = await db.execute(select(UserAssistant).where(UserAssistant.user_id == user.id))
        user_assistants = result.scalars().all()
        user_assistant_ids = set(ua.assistant_id for ua in user_assistants)
        
        # Get all calls and filter for user's assistants
        all_calls = vapi_service.get_calls()
        user_calls = [call for call in all_calls if call.get("assistantId") in user_assistant_ids]
        
        return user_calls
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/calls/{call_id}")
async def get_call(call_id: str, user=Depends(verify_jwt), db:AsyncSession=Depends(get_db)):
    """Get specific call by ID if it belongs to user's assistant"""
    try:
        # Get user's assistant IDs from database
        result = await db.execute(select(UserAssistant).where(UserAssistant.user_id == user.id))
        user_assistants = result.scalars().all()
        user_assistant_ids = set(ua.assistant_id for ua in user_assistants)
        
        # Get the call
        call = vapi_service.get_call(call_id)
        
        # Check if call belongs to user's assistant
        if call.get("assistantId") not in user_assistant_ids:
            raise HTTPException(status_code=404, detail="Call not found or access denied")
        
        return call
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
   

@app.post("/register")
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user"""
    if user_data.password != user_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    if not all([user_data.email, user_data.username, user_data.password]):
        raise HTTPException(status_code=400, detail="All fields are required")
    
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    user = User(
        email=user_data.email,
        username=user_data.username,
        password=get_password_hash(user_data.password)
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    return {
        "message": "User registered successfully",
        "access_token": create_access_token({"sub": user_data.email})
    }

@app.post("/login")
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login user"""
    if not all([user_data.email, user_data.password]):
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none()
    
    if not user or not pwd_context.verify(user_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    access_token = create_access_token({"sub": user_data.email})
    return {
        "message": "User logged in successfully",
        "access_token": access_token,
        "token_type": "bearer"
    }