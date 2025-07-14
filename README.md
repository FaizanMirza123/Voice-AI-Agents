# Voice AI Agents - SaaS Platform

A comprehensive SaaS platform for creating and managing AI-powered voice assistants using VAPI integration.

## 🚀 Features

### ✅ Current Features

- **User Authentication**: JWT-based authentication system
- **Assistant Management**: Create, read, update, delete voice assistants
- **Phone Number Management**: Manage phone numbers for voice assistants
- **Call Logs**: View and analyze voice assistant conversations
- **Dashboard**: Real-time statistics and quick actions
- **Static Pages**: Pricing, About, Contact pages

### 🎯 Core Functionality

- **Voice Assistant CRUD**: Full management of voice assistants via VAPI
- **Call Analytics**: Detailed conversation logs and statistics
- **Phone Integration**: Link phone numbers to assistants
- **User Management**: Secure user registration and authentication
- **Responsive Design**: Mobile-first, modern UI

## 🏗️ Architecture

### Backend (FastAPI)

- **Framework**: FastAPI with async/await support
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **API Integration**: VAPI service integration for voice assistants
- **Validation**: Pydantic schemas for request/response validation

### Frontend (Next.js)

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS for modern, responsive design
- **State Management**: React Context API for auth state
- **API Client**: Axios with interceptors for API calls
- **Notifications**: React Hot Toast for user feedback

## 📁 Project Structure

```
Voice-AI-Agents/
├── backend/
│   ├── config.py              # Database and API configuration
│   ├── main.py                # FastAPI application and routes
│   ├── models.py              # SQLAlchemy database models
│   ├── schemas.py             # Pydantic validation schemas
│   ├── services.py            # VAPI service integration
│   ├── requirements.txt       # Python dependencies
│   └── test.db               # SQLite database file
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js app router pages
│   │   │   ├── dashboard/     # Dashboard page
│   │   │   ├── assistants/    # Assistant management
│   │   │   ├── call-logs/     # Call logs viewer
│   │   │   ├── phone-numbers/ # Phone number management
│   │   │   ├── pricing/       # Pricing page
│   │   │   ├── about/         # About page
│   │   │   ├── contact/       # Contact page
│   │   │   └── ...           # Other pages
│   │   ├── components/        # Reusable React components
│   │   │   ├── AssistantCard.js
│   │   │   ├── AssistantModal.js
│   │   │   └── ProtectedRoute.js
│   │   ├── contexts/          # React Context providers
│   │   │   └── AuthContext.js
│   │   └── services/          # API service layer
│   │       └── apiService.js
│   ├── package.json           # Node.js dependencies
│   └── ...
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- VAPI account and API key

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Create virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure API key:**

   - Update `API_Key` in `config.py` with your VAPI API key

5. **Run the application:**
   ```bash
   uvicorn main:app --reload
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**

   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## 🔧 API Endpoints

### Authentication

- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /protected` - Protected route example

### Assistants

- `GET /assistants` - List all assistants
- `GET /assistants/{id}` - Get specific assistant
- `POST /assistants` - Create new assistant
- `PATCH /assistants/{id}` - Update assistant
- `DELETE /assistants/{id}` - Delete assistant

### Phone Numbers

- `GET /phone-numbers` - List all phone numbers
- `GET /phone-numbers/{id}` - Get specific phone number
- `POST /phone-numbers` - Create new phone number
- `PATCH /phone-numbers/{id}` - Update phone number
- `DELETE /phone-numbers/{id}` - Delete phone number

### Calls & Messages

- `GET /messages` - Get call logs organized by assistant
- `GET /calls` - Get all calls
- `GET /calls/{id}` - Get specific call

## 🔑 VAPI Integration

The platform integrates with VAPI (Voice API) for voice assistant functionality:

### Assistant Creation

```json
{
  "name": "Customer Support Assistant",
  "model": {
    "provider": "openai",
    "model": "gpt-4",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful customer support assistant..."
      }
    ]
  },
  "voice": {
    "provider": "11labs",
    "voiceId": "21m00Tcm4TlvDq8ikWAM"
  },
  "firstMessage": "Hello! How can I help you today?"
}
```

### Phone Number Management

```json
{
  "provider": "byo-phone-number",
  "number": "+1234567890",
  "credentialId": "your-credential-id"
}
```

## 📊 Database Schema

### Users Table

- `id` - Primary key
- `email` - Unique email address
- `username` - Unique username
- `password` - Hashed password

### Future Enhancements

- Add user-specific assistants (foreign key relationship)
- Call history tracking
- Usage analytics
- Billing information

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Pydantic schemas for data validation
- **CORS Protection**: Configured for production security
- **API Rate Limiting**: Ready for implementation

## 🎨 UI/UX Features

- **Modern Design**: Gradient backgrounds and clean layouts
- **Responsive Layout**: Mobile-first design approach
- **Interactive Components**: Modals, forms, and cards
- **Real-time Updates**: Live statistics and notifications
- **Loading States**: Smooth user experience with loading indicators

## 🔧 Development Tools

### Backend

- **FastAPI**: Modern, fast web framework
- **SQLAlchemy**: Python SQL toolkit and ORM
- **Pydantic**: Data validation using Python type hints
- **Uvicorn**: ASGI web server

### Frontend

- **Next.js**: React framework with app router
- **Tailwind CSS**: Utility-first CSS framework
- **React Hot Toast**: Elegant notifications
- **Axios**: HTTP client for API calls

## 📈 Future Enhancements

### Phase 1 (Current)

- ✅ Basic assistant management
- ✅ Call logs viewing
- ✅ Phone number management
- ✅ User authentication

### Phase 2 (Planned)

- [ ] Advanced analytics dashboard
- [ ] Real-time call monitoring
- [ ] Custom voice model integration
- [ ] Webhook support for call events

### Phase 3 (Future)

- [ ] Multi-tenant support
- [ ] Advanced billing system
- [ ] Integration marketplace
- [ ] Advanced security features

## 🚀 Deployment

### Backend Deployment

1. Set up production database (PostgreSQL recommended)
2. Configure environment variables
3. Deploy to cloud platform (AWS, GCP, Azure)
4. Set up SSL certificate
5. Configure monitoring and logging

### Frontend Deployment

1. Build production bundle: `npm run build`
2. Deploy to Vercel, Netlify, or similar platform
3. Configure environment variables
4. Set up custom domain

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📞 Support

For support, email support@voiceaiagents.com or join our community Discord server.

---

**Voice AI Agents** - Democratizing voice AI technology for businesses worldwide.
