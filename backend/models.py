from pydantic import BaseModel
from typing import Optional, List, Dict, Any
class User(BaseModel):
    email: str
    username:str
   
    hashed_password: Optional[str] = None
    