# 🎓 AI-Powered E-Learning Platform

A personalized e-learning web platform that dynamically generates quizzes using the Gemini API and uses a Python-based ML model to analyze student progress and recommend learning paths.

## 🚀 Features

- **AI-Powered Quiz Generation**: Dynamic quiz creation using Google's Gemini API
- **Intelligent Progress Analysis**: ML-based recommendations for personalized learning paths
- **Real-time Analytics**: Visual dashboards showing learning progress and performance
- **Secure Authentication**: Session-based user authentication and authorization
- **Responsive Design**: Modern UI built with Next.js and TailwindCSS

## 🏗️ Architecture

```
Frontend (Next.js) 
    ↓
Backend (Express.js) 
    ↓
├── Gemini API (Quiz Generation)
├── Flask ML Service (Progress Analysis)
└── MongoDB Atlas (Data Storage)
```

## 📦 Tech Stack

- **Frontend**: Next.js 14, TailwindCSS, Recharts
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB Atlas
- **ML Service**: Python, Flask, scikit-learn
- **AI**: Google Gemini API

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- MongoDB Atlas account
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd AI-Learn
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your credentials
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. ML Service Setup

```bash
cd ml_service
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python train_model.py  # Train the ML model
python app.py
```

ML Service runs on: `http://localhost:5001`

### 4. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local and add backend URL
npm run dev
```

Frontend runs on: `http://localhost:3000`

## 🔑 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret_key
GEMINI_API_KEY=your_gemini_api_key
ML_SERVICE_URL=http://localhost:5001
NODE_ENV=development
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### ML Service (.env)

```env
FLASK_PORT=5001
MODEL_PATH=./model.pkl
```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Courses
- `GET /courses` - Get all available courses

### Quiz
- `GET /quiz/generate?topic=<topic>` - Generate AI quiz
- `POST /quiz/submit` - Submit quiz answers
- `GET /quiz/history/:userId` - Get user's quiz history

### Analytics
- `GET /analyze/:userId` - Get AI-powered progress analysis

## 🎯 Usage Flow

1. **Register/Login** → Create account or sign in
2. **Browse Topics** → Select a subject to learn
3. **Take Quiz** → AI generates personalized questions
4. **View Progress** → Check dashboard for analytics
5. **Get Recommendations** → AI analyzes performance and suggests next steps

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy from `backend` directory

### ML Service (Render)
1. Create new Web Service
2. Set Python environment
3. Deploy from `ml_service` directory

### Database (MongoDB Atlas)
1. Create free cluster
2. Whitelist IP addresses
3. Get connection string

## 📊 ML Model Details

The ML model analyzes:
- Average quiz scores
- Time spent on topics
- Completion rates
- Recent improvement trends
- Topic diversity

Output:
- Performance level (Beginner/Intermediate/Advanced)
- Personalized learning recommendations

## 🔒 Security Features

- Secure password hashing (bcrypt)
- Session-based authentication
- CORS protection
- Environment variable protection
- Input validation and sanitization

## 🎨 Screenshots

(Add screenshots after deployment)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 👨‍💻 Author

Built with ❤️ for personalized learning

## 🙏 Acknowledgments

- Google Gemini API for AI quiz generation
- MongoDB Atlas for database hosting
- Vercel for frontend hosting
