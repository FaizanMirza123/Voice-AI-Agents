from fastapi import FastAPI, Request, HTTPException
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
import requests
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta, timezone

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


users_db = {}
assistant_id_to_name={}
SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256" 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta=None):
    to_encode = data.copy()
    if expires_delta is None:
        expires_delta = timedelta(minutes=15)
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.get("/")
def get_assisstants():
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
def get_messages():
    
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
async def register(request: Request):
    data = await request.json()
    method = data.get("method", "form")
    if method == "google":
        # Simulate Google signup (in real app, verify token)
        email = data.get("email")
        username = data.get("username", email.split("@")[0] if email else None)
        if not email:
            raise HTTPException(status_code=400, detail="Email required for Google signup")
        if email in users_db:
            raise HTTPException(status_code=400, detail="Email already registered")
        users_db[email] = {"username": username, "email": email, "oauth": "google"}
        token = create_access_token({"sub": email})
        return {"msg": "Registered with Google", "access_token": token}
    elif method == "facebook":
        # Simulate Facebook signup (in real app, verify token)
        email = data.get("email")
        username = data.get("username", email.split("@")[0] if email else None)
        if not email:
            raise HTTPException(status_code=400, detail="Email required for Facebook signup")
        if email in users_db:
            raise HTTPException(status_code=400, detail="Email already registered")
        users_db[email] = {"username": username, "email": email, "oauth": "facebook"}
        token = create_access_token({"sub": email})
        return {"msg": "Registered with Facebook", "access_token": token}
    else:
        # Standard form registration
        email = data.get("email")
        username = data.get("username")
        password = data.get("password")
        confirm_password = data.get("confirm_password")
        if not all([email, username, password, confirm_password]):
            raise HTTPException(status_code=400, detail="All fields are required")
        if password != confirm_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")
        if email in users_db:
            raise HTTPException(status_code=400, detail="Email already registered")
        hashed_password = get_password_hash(password)
        users_db[email] = {"username": username, "email": email, "hashed_password": hashed_password}
        token = create_access_token({"sub": email})
        return {"msg": "User registered successfully", "access_token": token}

