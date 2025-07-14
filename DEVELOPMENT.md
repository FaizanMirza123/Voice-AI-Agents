# Development Guide

## Quick Start Commands

### Backend

```bash
# Windows
cd backend
start.bat

# Linux/macOS
cd backend
chmod +x start.sh
./start.sh
```

### Frontend

```bash
cd frontend
npm run dev
```

## API Testing

### Register a new user

```bash
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "confirm_password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Assistant (requires auth token)

```bash
curl -X POST http://localhost:8000/assistants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Assistant",
    "prompt": "You are a helpful assistant",
    "voiceId": "21m00Tcm4TlvDq8ikWAM",
    "firstMessage": "Hello! How can I help you?"
  }'
```

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (config.py)

```python
API_Key = "your-vapi-api-key-here"
SECRET_KEY = "your-secret-key-here"
```

## Database

The application uses SQLite for development. The database file is created automatically at `backend/test.db`.

## Common Issues

1. **CORS errors**: Make sure backend is running on port 8000
2. **Auth errors**: Check JWT token expiration
3. **VAPI errors**: Verify your API key is valid
4. **Database errors**: Delete test.db and restart backend to recreate

## Development Tips

- Use React Dev Tools for frontend debugging
- Check browser console for JavaScript errors
- Use FastAPI's automatic documentation at http://localhost:8000/docs
- Monitor backend logs for API errors
