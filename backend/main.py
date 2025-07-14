from fastapi import FastAPI, Request, HTTPException
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
import requests
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta, timezone
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi import Depends,HTTPException,status
from config import Session_local
from models import User
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
import asyncio
from models import Base
from config import engine

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
API_Key= "2a94228d-fa25-47b1-95f4-96dc2039f8c7"
# API URL: https://api.vapi.ai/assistant/
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
        
        if result.scalar_one_or_none() is None:
            raise HTTPException(status_code=401, detail="User not found")
        return payload
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
async def protected_route(payload=Depends(verify_jwt)):
    return {"message": "You are authenticated", "user": payload}
    
@app.get("/assistants")
def get_assisstants(user=Depends(verify_jwt)):
    url = "https://api.vapi.ai/assistant"
    headers = {
        "Authorization": f"Bearer {API_Key}"
    }
    response=requests.get(url,headers=headers)
    if response.status_code == 200:
        data=response.json()
        if isinstance(data, list):
            for a in data:
                assistant_id_to_name[a.get("id")] = a.get("name")
            return data
        else:
            for a in data:
                assistant_id_to_name[a.get("id")] = a.get("name")
            return [data]
    else:
        return []
@app.get("/messages")
def get_messages(user=Depends(verify_jwt)):
    
    assistants_url = "https://api.vapi.ai/assistant"
    assistants_headers = {"Authorization": f"Bearer {API_Key}"}
    assistants_resp = requests.get(assistants_url, headers=assistants_headers)
    assistant_id_to_name = {}
    if assistants_resp.status_code == 200:
        assistants = assistants_resp.json()
        for a in assistants:
            assistant_id_to_name[a.get("id")] = a.get("name")

    # Now fetch calls and build messages_by_assistant
    url = "https://api.vapi.ai/call"
    headers = {"Authorization": f"Bearer {API_Key}"}
    call_resp = requests.get(url, headers=headers)
    messages_by_assistant = {}
    if call_resp.status_code == 200:
        calls = call_resp.json()
        for call in calls:
            assistantId = call.get("assistantId")
            name = assistant_id_to_name.get(assistantId, "Unknown Assistant")
            chat = call.get("messages", [])
            if name not in messages_by_assistant:
                messages_by_assistant[name] = []
                
            messages_by_assistant[name].append(chat)
        
    return messages_by_assistant
   

@app.post("/register")
async def register(request: Request, db:AsyncSession = Depends(get_db)):
    data= await request.json()
    method= data.get("method","form")
    email=data.get("email")
    username=data.get("username")
    password=data.get("password")
    confirm_password=data.get("confirm_password")
    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if not all([email,username,password,confirm_password]):
        raise HTTPException(status_code=400, detail="All fields are required")
    
    result=await db.execute(select(User).where(User.email==email))
    if result.scalar_one_or_none() is None and method == "form":
        user=User(
            email=email,
            username=username,
            password=get_password_hash(password)
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return {"message":"User registered successfully"
                ,"access_token":create_access_token({"sub":email})}
    else:
        raise HTTPException(status_code=400, detail="User with this email already exists")

@app.post("/login")
async def login(request:Request,db:AsyncSession = Depends(get_db)):
  data=await request.json()
  email=data.get("email")
  password=data.get("password")
  
  if email is None or password is None:
        raise HTTPException(status_code=400, detail="Email and password are required")
  result=await db.execute(select(User).where(User.email==email))
  user=result.scalar_one_or_none()
  if user is None:
      raise HTTPException(status_code=400, detail="Invalid email or password")
  if not pwd_context.verify(password,user.password):
      raise HTTPException(status_code=400, detail="Invalid email or password")
  access_token=create_access_token({"sub":email})
  return {
      "message":"User logged in successfully",
      "access_token":access_token,
      "token_type":"bearer"
  }