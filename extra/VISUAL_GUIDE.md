# 🎯 AI-Learn Platform - Visual Guide

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                                │
└─────────────────────────────────────────────────────────────────────┘

1. REGISTRATION/LOGIN
   ┌──────────┐
   │  Browser │ → localhost:3000/register
   └──────────┘
        │
        ▼
   [Create Account]
        │
        ▼
   POST /auth/register → Backend stores user in MongoDB
        │
        ▼
   Session Created → Redirect to Dashboard

2. TAKE QUIZ
   ┌──────────┐
   │Dashboard │ → "Take a Quiz" button
   └──────────┘
        │
        ▼
   Select Topic (Python, JavaScript, etc.)
        │
        ▼
   GET /quiz/generate?topic=python
        │
        ▼
   Backend → Gemini API → "Generate 5 MCQs about Python"
        │
        ▼
   Gemini Returns JSON Quiz
        │
        ▼
   Frontend Displays Questions
        │
        ▼
   User Answers Questions
        │
        ▼
   POST /quiz/submit → Backend checks answers
        │
        ▼
   Save to MongoDB Progress Collection
        │
        ▼
   Update User Stats
        │
        ▼
   Show Results to User

3. ANALYZE PROGRESS
   ┌──────────┐
   │Dashboard │ → "Analyze My Progress" button
   └──────────┘
        │
        ▼
   GET /analyze/:userId
        │
        ▼
   Backend fetches user's quiz history from MongoDB
        │
        ▼
   Calculate: avg_score, time_spent, topic_diversity, etc.
        │
        ▼
   POST to ML Service /analyze
        │
        ▼
   Flask ML Model predicts performance level
        │
        ▼
   Returns: "Intermediate" + recommendation
        │
        ▼
   Backend sends to frontend
        │
        ▼
   Dashboard shows AI insights with charts
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      COMPONENT INTERACTION                          │
└─────────────────────────────────────────────────────────────────────┘

Frontend (Next.js)                Backend (Express.js)
┌─────────────────┐              ┌──────────────────┐
│                 │              │                  │
│  index.tsx      │              │  server.js       │
│  (Landing)      │              │  (Port 5000)     │
│                 │              │                  │
│  login.tsx      │──────HTTP───▶│  routes/         │
│  register.tsx   │◀────JSON─────│  - auth.js       │
│                 │              │  - courses.js    │
│  dashboard.tsx  │              │  - quiz.js       │
│  (Analytics)    │              │  - analyze.js    │
│                 │              │                  │
│  quiz/          │              │  models/         │
│  - index.tsx    │              │  - User.js       │
│  - [topic].tsx  │              │  - Quiz.js       │
│                 │              │  - Progress.js   │
└─────────────────┘              │                  │
                                 │  middleware/     │
                                 │  - auth.js       │
                                 └────┬────┬────┬───┘
                                      │    │    │
                 ┌────────────────────┘    │    └─────────────────┐
                 ▼                         ▼                       ▼
        ┌────────────────┐      ┌──────────────────┐    ┌─────────────────┐
        │  MongoDB Atlas │      │   Gemini API     │    │  ML Service     │
        │                │      │                  │    │  (Flask)        │
        │  Collections:  │      │  generates:      │    │  Port 5001      │
        │  - users       │      │  - questions     │    │                 │
        │  - quizzes     │      │  - options       │    │  app.py         │
        │  - progress    │      │  - answers       │    │  train_model.py │
        │  - sessions    │      │                  │    │  model.pkl      │
        └────────────────┘      └──────────────────┘    └─────────────────┘
```

---

## Database Schema

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MONGODB COLLECTIONS                         │
└─────────────────────────────────────────────────────────────────────┘

USERS Collection
┌──────────────────────────────────────────────────────┐
│ _id: ObjectId                                        │
│ name: String                                         │
│ email: String (unique)                               │
│ passwordHash: String (bcrypt)                        │
│ role: String (student/admin)                         │
│ learningStats:                                       │
│   ├─ totalQuizzesTaken: Number                      │
│   ├─ averageScore: Number                           │
│   ├─ totalTimeSpent: Number                         │
│   ├─ topicsExplored: [String]                       │
│   └─ lastActive: Date                               │
│ createdAt: Date                                      │
└──────────────────────────────────────────────────────┘

QUIZZES Collection
┌──────────────────────────────────────────────────────┐
│ _id: ObjectId                                        │
│ topic: String                                        │
│ questions: [                                         │
│   {                                                  │
│     question: String                                 │
│     options: [String, String, String, String]       │
│     answer: String                                   │
│   }                                                  │
│ ]                                                    │
│ difficulty: String (easy/medium/hard)                │
│ createdBy: String (AI)                               │
│ createdAt: Date                                      │
└──────────────────────────────────────────────────────┘

PROGRESS Collection
┌──────────────────────────────────────────────────────┐
│ _id: ObjectId                                        │
│ userId: ObjectId (ref: User)                         │
│ quizId: ObjectId (ref: Quiz)                         │
│ quizTopic: String                                    │
│ score: Number (0-100)                                │
│ totalQuestions: Number                               │
│ correctAnswers: Number                               │
│ timeSpent: Number (seconds)                          │
│ answers: [                                           │
│   {                                                  │
│     questionIndex: Number                            │
│     userAnswer: String                               │
│     correctAnswer: String                            │
│     isCorrect: Boolean                               │
│   }                                                  │
│ ]                                                    │
│ completedAt: Date                                    │
└──────────────────────────────────────────────────────┘
```

---

## API Request/Response Examples

```
┌─────────────────────────────────────────────────────────────────────┐
│                     QUIZ GENERATION FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

1. Frontend Request
   GET http://localhost:5000/quiz/generate?topic=python&difficulty=medium
   Headers: Cookie: connect.sid=...

2. Backend Processing
   ┌─────────────────────────────────────────┐
   │ 1. Check user authentication           │
   │ 2. Validate topic parameter            │
   │ 3. Call Gemini API with prompt:        │
   │    "Generate 5 MCQs about python..."   │
   │ 4. Parse Gemini JSON response          │
   │ 5. Save quiz to MongoDB                │
   │ 6. Remove answers from response        │
   └─────────────────────────────────────────┘

3. Backend Response
   {
     "quizId": "64f1a2b3c4d5e6f7g8h9i0j1",
     "topic": "python",
     "difficulty": "medium",
     "questions": [
       {
         "question": "What is a list in Python?",
         "options": [
           "A mutable sequence",
           "An immutable sequence",
           "A dictionary",
           "A function"
         ]
       },
       // ... 4 more questions
     ]
   }

4. Frontend Displays Quiz
   ┌──────────────────────────────────────┐
   │  Question 1 of 5                     │
   │  ──────────────────                  │
   │  What is a list in Python?           │
   │                                      │
   │  ○ A mutable sequence                │
   │  ○ An immutable sequence             │
   │  ○ A dictionary                      │
   │  ○ A function                        │
   │                                      │
   │  [Previous]           [Next]         │
   └──────────────────────────────────────┘
```

---

## ML Model Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ML MODEL TRAINING & PREDICTION                   │
└─────────────────────────────────────────────────────────────────────┘

TRAINING (One-time setup)
┌────────────────────────────────────────────────────┐
│ 1. Generate Synthetic Data (1000 samples)         │
│    - Beginner: avg_score ~45, low diversity       │
│    - Intermediate: avg_score ~70, medium diversity│
│    - Advanced: avg_score ~88, high diversity      │
│                                                    │
│ 2. Train Random Forest Classifier                 │
│    - Features: 5 (score, time, completion, etc.)  │
│    - Labels: 3 (Beginner, Intermediate, Advanced) │
│    - Accuracy: ~95%                                │
│                                                    │
│ 3. Save Model                                      │
│    - joblib.dump(model, 'model.pkl')              │
└────────────────────────────────────────────────────┘

PREDICTION (Real-time)
┌────────────────────────────────────────────────────┐
│ Input Features:                                    │
│ {                                                  │
│   "avg_score": 78,                                 │
│   "time_spent": 120,                               │
│   "completion_rate": 0.8,                          │
│   "topic_diversity": 0.5,                          │
│   "recent_improvement": 12                         │
│ }                                                  │
│                                                    │
│ Model Processing:                                  │
│ ┌────────────────────────────────────────┐        │
│ │  Load model.pkl                        │        │
│ │  Normalize features                    │        │
│ │  Random Forest prediction              │        │
│ │  Generate recommendation               │        │
│ └────────────────────────────────────────┘        │
│                                                    │
│ Output:                                            │
│ {                                                  │
│   "performance_level": "Intermediate",             │
│   "recommendation": "Great progress! Keep up..."   │
│ }                                                  │
└────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PRODUCTION DEPLOYMENT                          │
└─────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────┐
                    │      INTERNET        │
                    │   (End Users)        │
                    └──────────┬───────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
    ┌──────────────────────┐      ┌──────────────────────┐
    │   Vercel CDN         │      │   Vercel CDN         │
    │   (Global)           │      │   (Global)           │
    └──────────┬───────────┘      └──────────┬───────────┘
               │                             │
               ▼                             ▼
    ┌──────────────────────┐      ┌──────────────────────┐
    │  Frontend Server     │      │  Frontend Server     │
    │  (Next.js)           │      │  (Next.js)           │
    │  ai-learn.vercel.app │      │  Multiple Regions    │
    └──────────┬───────────┘      └──────────────────────┘
               │
               │ HTTPS API Calls
               │
               ▼
    ┌──────────────────────────────────────────┐
    │  Backend Server (Render)                 │
    │  ai-learn-backend.onrender.com           │
    │  ┌────────────────────────────────────┐  │
    │  │  Express.js Application            │  │
    │  │  - REST API Endpoints              │  │
    │  │  - Session Management              │  │
    │  │  - Business Logic                  │  │
    │  └────────┬────────────────┬──────────┘  │
    └───────────┼────────────────┼─────────────┘
                │                │
       ┌────────┴────┐    ┌─────┴──────────┐
       ▼             ▼    ▼                ▼
┌────────────┐  ┌────────────┐  ┌──────────────────┐
│ MongoDB    │  │ Gemini API │  │ ML Service       │
│ Atlas      │  │ (Google)   │  │ (Render)         │
│            │  │            │  │                  │
│ M0 Free    │  │ Free Tier  │  │ ai-learn-ml.     │
│ Cluster    │  │            │  │ onrender.com     │
│            │  │            │  │                  │
│ US-East-1  │  │ Global     │  │ Flask + Model    │
└────────────┘  └────────────┘  └──────────────────┘

FREE TIER LIMITS:
├─ Vercel: Unlimited deployments, 100GB bandwidth
├─ Render: 750 hours/month, sleeps after 15min inactivity
├─ MongoDB Atlas: 512MB storage, shared cluster
└─ Gemini API: 60 requests/minute

COST: $0/month (within free tier limits)
```

---

## Security Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                              │
└─────────────────────────────────────────────────────────────────────┘

1. AUTHENTICATION
   ┌─────────────────────────────────────────┐
   │ User Login                              │
   │   └─▶ Password Check (bcrypt)           │
   │       └─▶ Session Created               │
   │           └─▶ Cookie Sent (HttpOnly)    │
   │               └─▶ Stored in MongoDB     │
   └─────────────────────────────────────────┘

2. AUTHORIZATION
   ┌─────────────────────────────────────────┐
   │ API Request                             │
   │   └─▶ requireAuth Middleware            │
   │       └─▶ Check Session Cookie          │
   │           └─▶ Verify User ID            │
   │               └─▶ Grant/Deny Access     │
   └─────────────────────────────────────────┘

3. DATA PROTECTION
   ┌─────────────────────────────────────────┐
   │ Passwords → bcrypt hash + salt          │
   │ API Keys → Environment variables        │
   │ Sessions → MongoDB encrypted storage    │
   │ CORS → Restricted to frontend domain    │
   │ HTTPS → Required in production          │
   └─────────────────────────────────────────┘

4. INPUT VALIDATION
   ┌─────────────────────────────────────────┐
   │ Email → express-validator               │
   │ Password → Min length check             │
   │ Quiz Answers → Type validation          │
   │ User Input → Sanitization               │
   └─────────────────────────────────────────┘
```

---

**📚 This visual guide complements the technical documentation!**
