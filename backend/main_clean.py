from fastapi import FastAPI, Request, HTTPException, Depends
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta, timezone
import requests
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from models import User, UserAssistant, get_db
from schemas import UserCreate, UserLogin, AssistantCreate, AssistantUpdate, PhoneNumberCreate, PhoneNumberUpdate, PhoneNumberResponse
import os
from services import VAPIService

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# JWT config
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Initialize VAPI service
vapi_service = VAPIService()

# Helper functions
def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def verify_jwt(credentials: HTTPAuthorizationCredentials = Depends(security), db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")

# User authentication endpoints
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

# Assistant endpoints
@app.get("/assistants")
async def get_assistants(user=Depends(verify_jwt), db: AsyncSession = Depends(get_db)):
    """Get assistants for the authenticated user"""
    try:
        # Get user's assistant IDs from database
        result = await db.execute(select(UserAssistant).where(UserAssistant.user_id == user.id))
        user_assistants = result.scalars().all()
        
        if not user_assistants:
            return []
        
        # Get full assistant data from VAPI
        all_assistants = vapi_service.get_assistants()
        user_assistant_ids = set(ua.assistant_id for ua in user_assistants)
        
        # Filter assistants for this user
        user_assistants_data = [
            assistant for assistant in all_assistants 
            if assistant.get("id") in user_assistant_ids
        ]
        
        return user_assistants_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/assistants")
async def create_assistant(assistant_data: AssistantCreate, user=Depends(verify_jwt), db: AsyncSession = Depends(get_db)):
    """Create a new assistant for the authenticated user"""
    try:
        # Create assistant in VAPI
        assistant = vapi_service.create_assistant(assistant_data.dict())
        
        # Associate assistant with user in database
        user_assistant = UserAssistant(
            user_id=user.id,
            assistant_id=assistant["id"],
            assistant_name=assistant.get("name", "Unknown Assistant")
        )
        db.add(user_assistant)
        await db.commit()
        
        return assistant
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/assistants/{assistant_id}")
async def update_assistant(assistant_id: str, assistant_data: AssistantUpdate, user=Depends(verify_jwt), db: AsyncSession = Depends(get_db)):
    """Update an assistant if it belongs to the user"""
    try:
        # Verify assistant belongs to user
        result = await db.execute(
            select(UserAssistant).where(
                UserAssistant.user_id == user.id,
                UserAssistant.assistant_id == assistant_id
            )
        )
        user_assistant = result.scalar_one_or_none()
        
        if not user_assistant:
            raise HTTPException(status_code=404, detail="Assistant not found or access denied")
        
        # Update assistant in VAPI
        update_data = {k: v for k, v in assistant_data.dict().items() if v is not None}
        assistant = vapi_service.update_assistant(assistant_id, update_data)
        
        # Update assistant name in database if changed
        if assistant_data.name:
            user_assistant.assistant_name = assistant_data.name
            await db.commit()
        
        return assistant
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/assistants/{assistant_id}")
async def delete_assistant(assistant_id: str, user=Depends(verify_jwt), db: AsyncSession = Depends(get_db)):
    """Delete an assistant if it belongs to the user"""
    try:
        # Verify assistant belongs to user
        result = await db.execute(
            select(UserAssistant).where(
                UserAssistant.user_id == user.id,
                UserAssistant.assistant_id == assistant_id
            )
        )
        user_assistant = result.scalar_one_or_none()
        
        if not user_assistant:
            raise HTTPException(status_code=404, detail="Assistant not found or access denied")
        
        # Delete assistant from VAPI
        vapi_service.delete_assistant(assistant_id)
        
        # Remove association from database
        await db.delete(user_assistant)
        await db.commit()
        
        return {"message": "Assistant deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Phone number endpoints
@app.get("/phone-numbers", response_model=List[PhoneNumberResponse])
async def get_phone_numbers(user=Depends(verify_jwt), db: AsyncSession = Depends(get_db)):
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
async def get_phone_number(phone_id: str, user=Depends(verify_jwt), db: AsyncSession = Depends(get_db)):
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
async def create_phone_number(phone_data: PhoneNumberCreate, user=Depends(verify_jwt), db: AsyncSession = Depends(get_db)):
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
async def update_phone_number(phone_id: str, phone_data: PhoneNumberUpdate, user=Depends(verify_jwt), db: AsyncSession = Depends(get_db)):
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
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/phone-numbers/{phone_id}")
async def delete_phone_number(phone_id: str, user=Depends(verify_jwt), db: AsyncSession = Depends(get_db)):
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

# Call and message endpoints
@app.get("/messages")
async def get_messages(user=Depends(verify_jwt), db: AsyncSession = Depends(get_db)):
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
async def get_calls(user=Depends(verify_jwt), db: AsyncSession = Depends(get_db)):
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
async def get_call(call_id: str, user=Depends(verify_jwt), db: AsyncSession = Depends(get_db)):
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
