"""
Service layer for VAPI API interactions
"""
import requests
from typing import List, Dict, Optional, Any
from fastapi import HTTPException
from config import API_Key
import json

class VAPIService:
    def __init__(self):
        self.base_url = "https://api.vapi.ai"
        self.headers = {
            "Authorization": f"Bearer {API_Key}",
            "Content-Type": "application/json"
        }
    
    def _make_request(self, method: str, endpoint: str, data: Dict = None) -> Dict:
        """Make HTTP request to VAPI API"""
        url = f"{self.base_url}{endpoint}"
        
        try:
            if method == "GET":
                response = requests.get(url, headers=self.headers)
            elif method == "POST":
                response = requests.post(url, headers=self.headers, json=data)
            elif method == "PATCH":
                response = requests.patch(url, headers=self.headers, json=data)
            elif method == "DELETE":
                response = requests.delete(url, headers=self.headers)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            if response.status_code >= 400:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"VAPI API error: {response.text}"
                )
            
            return response.json() if response.content else {}
            
        except requests.exceptions.RequestException as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to connect to VAPI API: {str(e)}"
            )
    
    # Assistant methods
    def get_assistants(self) -> List[Dict]:
        """Get all assistants"""
        data = self._make_request("GET", "/assistant")
        return data if isinstance(data, list) else [data] if data else []
    
    def get_assistant(self, assistant_id: str) -> Dict:
        """Get specific assistant by ID"""
        return self._make_request("GET", f"/assistant/{assistant_id}")
    
    def create_assistant(self, assistant_data: Dict) -> Dict:
        """Create new assistant"""
        # Transform the data to match VAPI's expected format
        vapi_data = {
            "name": assistant_data.get("name"),
            "model": {
                "provider": "openai",
                "model": "gpt-4",
                "messages": [
                    {
                        "role": "system",
                        "content": assistant_data.get("prompt", "You are a helpful assistant.")
                    }
                ]
            },
            "voice": {
                "provider": "11labs",
                "voiceId": assistant_data.get("voiceId", "21m00Tcm4TlvDq8ikWAM")
            }
        }
        
        # Add first message if provided
        if assistant_data.get("firstMessage"):
            vapi_data["firstMessage"] = assistant_data["firstMessage"]
        
        return self._make_request("POST", "/assistant", vapi_data)
    
    def update_assistant(self, assistant_id: str, assistant_data: Dict) -> Dict:
        """Update assistant"""
        # Transform the data to match VAPI's expected format
        vapi_data = {}
        
        if "name" in assistant_data:
            vapi_data["name"] = assistant_data["name"]
        
        if "prompt" in assistant_data:
            vapi_data["model"] = {
                "provider": "openai",
                "model": "gpt-4",
                "messages": [
                    {
                        "role": "system",
                        "content": assistant_data["prompt"]
                    }
                ]
            }
        
        if "voiceId" in assistant_data:
            vapi_data["voice"] = {
                "provider": "11labs",
                "voiceId": assistant_data["voiceId"]
            }
        
        if "firstMessage" in assistant_data:
            vapi_data["firstMessage"] = assistant_data["firstMessage"]
        
        return self._make_request("PATCH", f"/assistant/{assistant_id}", vapi_data)
    
    def delete_assistant(self, assistant_id: str) -> Dict:
        """Delete assistant"""
        return self._make_request("DELETE", f"/assistant/{assistant_id}")
    
    # Phone number methods
    def get_phone_numbers(self) -> List[Dict]:
        """Get all phone numbers"""
        data = self._make_request("GET", "/phone-number")
        return data if isinstance(data, list) else [data] if data else []
    
    def get_phone_number(self, phone_id: str) -> Dict:
        """Get specific phone number by ID"""
        return self._make_request("GET", f"/phone-number/{phone_id}")
    
    def create_phone_number(self, phone_data: Dict) -> Dict:
        """Create new phone number"""
        return self._make_request("POST", "/phone-number", phone_data)
    
    def update_phone_number(self, phone_id: str, phone_data: Dict) -> Dict:
        """Update phone number"""
        return self._make_request("PATCH", f"/phone-number/{phone_id}", phone_data)
    
    def delete_phone_number(self, phone_id: str) -> Dict:
        """Delete phone number"""
        return self._make_request("DELETE", f"/phone-number/{phone_id}")
    
    # Call methods
    def get_calls(self) -> List[Dict]:
        """Get all calls"""
        data = self._make_request("GET", "/call")
        return data if isinstance(data, list) else [data] if data else []
    
    def get_call(self, call_id: str) -> Dict:
        """Get specific call by ID"""
        return self._make_request("GET", f"/call/{call_id}")

# Create service instance
vapi_service = VAPIService()
