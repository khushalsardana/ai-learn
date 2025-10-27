# API Documentation - AI-Learn Platform

## Base URL
- **Development**: `http://localhost:5000`
- **Production**: `https://your-backend.onrender.com`

All endpoints return JSON responses.

---

## Authentication

Session-based authentication using `express-session`. Session cookie is automatically managed.

---

## Endpoints

### Authentication

#### POST `/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Errors:**
- `400` - Validation error or user already exists
- `500` - Server error

---

#### POST `/auth/login`
Login user and create session.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "learningStats": {
      "totalQuizzesTaken": 5,
      "averageScore": 78,
      "totalTimeSpent": 1200,
      "topicsExplored": ["python", "javascript"]
    }
  }
}
```

**Errors:**
- `401` - Invalid credentials
- `500` - Server error

---

#### POST `/auth/logout`
Logout user and destroy session.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

#### GET `/auth/me`
Get current user info.

**Headers:** Requires authentication (session cookie)

**Response (200):**
```json
{
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "learningStats": {
      "totalQuizzesTaken": 5,
      "averageScore": 78,
      "totalTimeSpent": 1200,
      "topicsExplored": ["python", "javascript"]
    }
  }
}
```

**Errors:**
- `401` - Unauthorized (not logged in)
- `404` - User not found
- `500` - Server error

---

### Courses

#### GET `/courses`
Get all available courses.

**Headers:** Requires authentication

**Response (200):**
```json
{
  "courses": [
    {
      "id": "1",
      "title": "Python Programming",
      "topic": "python",
      "description": "Master Python programming from basics to advanced concepts",
      "difficulty": "medium",
      "icon": "🐍",
      "color": "bg-blue-500"
    }
  ],
  "total": 8
}
```

---

#### GET `/courses/:topic`
Get course by topic.

**Headers:** Requires authentication

**Response (200):**
```json
{
  "course": {
    "id": "1",
    "title": "Python Programming",
    "topic": "python",
    "description": "Master Python programming from basics to advanced concepts",
    "difficulty": "medium",
    "icon": "🐍",
    "color": "bg-blue-500"
  }
}
```

**Errors:**
- `404` - Course not found

---

### Quiz

#### GET `/quiz/generate`
Generate AI-powered quiz using Gemini API.

**Headers:** Requires authentication

**Query Parameters:**
- `topic` (required): Topic for quiz (e.g., "python", "javascript")
- `difficulty` (optional): "easy", "medium", "hard" (default: "medium")
- `count` (optional): Number of questions (default: 5)

**Example:**
```
GET /quiz/generate?topic=python&difficulty=medium&count=5
```

**Response (200):**
```json
{
  "quizId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "topic": "python",
  "difficulty": "medium",
  "questions": [
    {
      "question": "What is Python?",
      "options": [
        "A programming language",
        "A snake",
        "A framework",
        "An operating system"
      ]
    }
  ]
}
```

**Note:** Correct answers are NOT sent to frontend to prevent cheating.

**Errors:**
- `400` - Topic is required
- `500` - Failed to generate quiz (Gemini API error)

---

#### POST `/quiz/submit`
Submit quiz answers and get results.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "quizId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "answers": [
    "A programming language",
    "Option B",
    "Option A",
    "Option C",
    "Option D"
  ],
  "timeSpent": 180
}
```

**Response (200):**
```json
{
  "message": "Quiz submitted successfully",
  "result": {
    "score": 80,
    "correctAnswers": 4,
    "totalQuestions": 5,
    "percentage": 80,
    "timeSpent": 180,
    "answers": [
      {
        "questionIndex": 0,
        "userAnswer": "A programming language",
        "correctAnswer": "A programming language",
        "isCorrect": true
      },
      {
        "questionIndex": 1,
        "userAnswer": "Option B",
        "correctAnswer": "Option A",
        "isCorrect": false
      }
    ]
  }
}
```

**Errors:**
- `400` - Missing required fields
- `404` - Quiz not found
- `500` - Server error

---

#### GET `/quiz/history/:userId`
Get quiz history for a user.

**Headers:** Requires authentication

**Response (200):**
```json
{
  "history": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "userId": "64f1a2b3c4d5e6f7g8h9i0j2",
      "quizTopic": "python",
      "score": 80,
      "totalQuestions": 5,
      "correctAnswers": 4,
      "timeSpent": 180,
      "completedAt": "2025-10-26T10:30:00.000Z"
    }
  ],
  "total": 10
}
```

**Errors:**
- `403` - Unauthorized (can only view own history)
- `500` - Server error

---

### Analytics

#### GET `/analyze/:userId`
Get AI-powered progress analysis.

**Headers:** Requires authentication

**Response (200):**
```json
{
  "performance_level": "Intermediate",
  "recommendation": "Great progress! Keep up the momentum and explore more advanced concepts.",
  "stats": {
    "totalQuizzes": 10,
    "avgScore": 78,
    "totalTimeSpent": 1200,
    "avgTimePerQuiz": 120,
    "completionRate": 100,
    "topicDiversity": 50,
    "recentImprovement": 12
  },
  "topicPerformance": {
    "python": {
      "count": 5,
      "totalScore": 400,
      "avgScore": 80
    },
    "javascript": {
      "count": 5,
      "totalScore": 380,
      "avgScore": 76
    }
  },
  "weakTopics": [
    {
      "topic": "javascript",
      "avgScore": 65
    }
  ],
  "strongTopics": [
    {
      "topic": "python",
      "avgScore": 85
    }
  ]
}
```

**Response when no data (200):**
```json
{
  "message": "Not enough data for analysis",
  "recommendation": "Take more quizzes to get personalized recommendations!",
  "performance_level": "Beginner",
  "stats": {
    "totalQuizzes": 0,
    "avgScore": 0,
    "totalTimeSpent": 0,
    "completionRate": 0
  }
}
```

**Errors:**
- `403` - Unauthorized (can only analyze own progress)
- `404` - User not found
- `500` - Server error

---

## Error Response Format

All errors follow this format:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

**Common Error Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. In production, consider adding:
- API rate limiting (e.g., 100 requests/minute)
- Quiz generation limiting (e.g., 10 quizzes/hour)
- User registration limiting (e.g., 3 accounts/IP/day)

---

## CORS

CORS is enabled for the frontend origin specified in `CORS_ORIGIN` environment variable.

Credentials (cookies) are allowed for session management.

---

## Session Management

Sessions are stored in MongoDB using `connect-mongo`.

**Session Cookie Settings:**
- `maxAge`: 7 days
- `httpOnly`: true
- `secure`: true (production only)
- `sameSite`: 'lax' (development) or 'none' (production)

---

## ML Service Integration

The backend communicates with the ML service for progress analysis:

**ML Service Endpoint:** `POST /analyze`

**Request:**
```json
{
  "avg_score": 78,
  "time_spent": 120,
  "completion_rate": 0.8,
  "topic_diversity": 0.5,
  "recent_improvement": 12
}
```

**Response:**
```json
{
  "performance_level": "Intermediate",
  "recommendation": "Great progress! Keep up the momentum."
}
```

If ML service is unavailable, the backend uses rule-based fallback analysis.

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}' \
  -c cookies.txt
```

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -c cookies.txt
```

### Generate Quiz
```bash
curl http://localhost:5000/quiz/generate?topic=python \
  -b cookies.txt
```

### Submit Quiz
```bash
curl -X POST http://localhost:5000/quiz/submit \
  -H "Content-Type: application/json" \
  -d '{"quizId":"...","answers":["A","B","C","D","A"],"timeSpent":180}' \
  -b cookies.txt
```

---

## Postman Collection

Import this JSON to test all endpoints in Postman:

1. Create new Collection "AI-Learn API"
2. Set variable `{{baseURL}}` = `http://localhost:5000`
3. Enable cookie jar for session management
4. Import requests from examples above

---

**API Version:** 1.0  
**Last Updated:** October 26, 2025
