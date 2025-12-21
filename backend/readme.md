# Backend API Documentation

## Base URL

- **Local**: `http://localhost:8000`
- **Production**: `https://your-backend.vercel.app`

## API Endpoints

### Authentication

#### POST `/auth/signup`

Register a new user with background information.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "software_background": "Python, JavaScript, 2 years experience",
  "hardware_background": "Arduino, Raspberry Pi basics"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

#### POST `/auth/login`

Authenticate existing user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

#### GET `/auth/me`

Get current user information.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "name": "John Doe"
}
```

---

### Chat / RAG System

#### POST `/chat/ask`

Ask questions about textbook content.

**Headers:**

```
Authorization: Bearer <token>  (optional)
```

**Request Body:**

```json
{
  "question": "What is ROS 2?",
  "selected_text": "ROS 2 is a middleware framework...",
  "chapter_id": "module1-ros2-basics"
}
```

**Response:**

```json
{
  "answer": "ROS 2 is the Robot Operating System 2, a middleware framework...",
  "context_used": "ROS 2 is a middleware framework that enables..."
}
```

**Notes:**

- If `selected_text` is provided, AI answers based on that text
- Otherwise, searches Qdrant for relevant content using `chapter_id`
- Saves to chat history if authenticated

---

### Personalization

#### POST `/personalize`

Personalize chapter content based on user background.

**Headers:**

```
Authorization: Bearer <token>  (required)
```

**Request Body:**

```json
{
  "chapter_id": "module1-ros2-basics"
}
```

**Response:**

```json
{
  "personalized_content": "<h1>ROS 2 Basics</h1><p>Given your Python experience...</p>"
}
```

**Notes:**

- Uses user's `software_background` and `hardware_background` from signup
- Adjusts technical depth and examples accordingly

---

#### POST `/translate`

Translate chapter content to target language.

**Headers:**

```
Authorization: Bearer <token>  (required)
```

**Request Body:**

```json
{
  "chapter_id": "module1-ros2-basics",
  "target_language": "urdu"
}
```

**Response:**

```json
{
  "translated_content": "<h1>ROS 2 بنیادی باتیں</h1><p>ROS 2 ایک middleware framework ہے...</p>"
}
```

---

### Health Check

#### GET `/`

API root endpoint.

**Response:**

```json
{
  "message": "Physical AI Textbook API"
}
```

---

#### GET `/health`

Health check endpoint.

**Response:**

```json
{
  "status": "healthy"
}
```

---

## Environment Variables

Create `.env` file in backend directory:

```env
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
QDRANT_URL=https://xyz-abc.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your-secret-key-min-32-characters-long
CORS_ORIGINS=http://localhost:3000,https://yourusername.github.io
```

---

## Setup Steps

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Run Locally

```bash
uvicorn app.main:app --reload
```

API will be available at `http://localhost:8000`

### 4. Test Endpoints

```bash
# Health check
curl http://localhost:8000/health

# Signup
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User",
    "software_background": "Python beginner",
    "hardware_background": "None"
  }'
```

---

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Deploy

```bash
cd backend
vercel --prod
```

### 3. Set Environment Variables

In Vercel dashboard:

- Go to Settings > Environment Variables
- Add all variables from `.env`

### 4. Redeploy

```bash
vercel --prod
```

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    software_background TEXT,
    hardware_background TEXT,
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Chat History Table

```sql
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    chapter_id VARCHAR(100),
    selected_text TEXT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Error Responses

### 400 Bad Request

```json
{
  "detail": "Email already registered"
}
```

### 401 Unauthorized

```json
{
  "detail": "Invalid credentials"
}
```

### 404 Not Found

```json
{
  "detail": "User not found"
}
```

---

## Rate Limits

- No rate limits in development
- Production: 100 requests/minute per IP

---

## Support

For issues or questions:

- GitHub: https://github.com/yourusername/physical-ai-textbook
- Email: your-email@example.com
