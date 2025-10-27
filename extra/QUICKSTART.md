# Quick Start Guide - AI-Learn Platform

## 🚀 Get Started in 5 Minutes!

### Step 1: Clone the Project
```bash
cd c:\Users\khush\Desktop\project\AI-Learn
```

### Step 2: Install Dependencies

#### Backend
```powershell
cd backend
npm install
```

#### Frontend
```powershell
cd ..\frontend
npm install
```

#### ML Service
```powershell
cd ..\ml_service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Step 3: Set Up Environment Variables

#### Backend - Create `.env` file
```powershell
cd ..\backend
Copy-Item .env.example .env
```

Edit `backend\.env` and add:
- **MONGODB_URI**: Get from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **GEMINI_API_KEY**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

#### Frontend - Create `.env.local` file
```powershell
cd ..\frontend
Copy-Item .env.example .env.local
```

#### ML Service - Create `.env` file
```powershell
cd ..\ml_service
Copy-Item .env.example .env
```

### Step 4: Train the ML Model
```powershell
cd ml_service
python train_model.py
```

Expected output:
```
🤖 AI-Learn ML Model Training
==================================================
📊 Generating synthetic training data...
✅ Generated 1000 training samples
✅ Model trained successfully!
Accuracy: 95.00%
💾 Model saved to model.pkl
```

### Step 5: Start All Services

#### Terminal 1 - Backend
```powershell
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

#### Terminal 2 - ML Service
```powershell
cd ml_service
venv\Scripts\activate
python app.py
```
ML Service runs on: http://localhost:5001

#### Terminal 3 - Frontend
```powershell
cd frontend
npm run dev
```
Frontend runs on: http://localhost:3000

### Step 6: Test the Application

1. Open browser: http://localhost:3000
2. Click **"Get Started Free"**
3. Register with:
   - Name: Your Name
   - Email: test@example.com
   - Password: test123
4. Login
5. Take a quiz
6. View dashboard and analyze progress!

---

## 📝 Common Issues

### MongoDB Connection Error
**Problem**: `MongooseError: Connect ECONNREFUSED`
**Solution**: 
1. Check MongoDB Atlas is running
2. Verify connection string in `backend\.env`
3. Whitelist your IP in MongoDB Atlas Network Access

### Gemini API Error
**Problem**: `Failed to generate quiz`
**Solution**:
1. Verify API key is correct in `backend\.env`
2. Check API quota at Google AI Studio
3. Ensure API key has no restrictions

### Port Already in Use
**Problem**: `Error: listen EADDRINUSE: address already in use :::5000`
**Solution**:
```powershell
# Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### ML Model Not Found
**Problem**: `Model not found at ./model.pkl`
**Solution**:
```powershell
cd ml_service
python train_model.py
```

---

## 🧪 Test Accounts

For testing, you can create multiple accounts or use:

**Test User 1:**
- Email: `student1@test.com`
- Password: `test123`

**Test User 2:**
- Email: `student2@test.com`
- Password: `test123`

---

## 📊 Available Quiz Topics

- Python Programming 🐍
- JavaScript Fundamentals 📜
- Data Structures 🌳
- React.js ⚛️
- Node.js & Express 🟢
- Machine Learning Basics 🤖
- SQL & Databases 🗄️
- Web Development 🌐

---

## 🔧 Development Commands

### Backend
```powershell
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Frontend
```powershell
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

### ML Service
```powershell
python app.py                # Start Flask server
python train_model.py        # Retrain ML model
```

---

## 📁 Project Structure
```
AI-Learn/
├── backend/
│   ├── config/          # Database configuration
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/       # Next.js pages
│   │   ├── lib/         # API client
│   │   └── styles/      # Global styles
│   ├── package.json
│   └── next.config.js
├── ml_service/
│   ├── app.py           # Flask server
│   ├── train_model.py   # ML training
│   ├── requirements.txt
│   └── model.pkl        # Trained model
├── README.md
├── DEPLOYMENT.md
└── .gitignore
```

---

## 🚀 Next Steps

1. ✅ Complete local setup
2. 📚 Take sample quizzes
3. 📊 Review analytics dashboard
4. 🤖 Test AI progress analysis
5. 🌐 Deploy to production (see DEPLOYMENT.md)

---

## 📚 Documentation

- **README.md** - Project overview
- **DEPLOYMENT.md** - Production deployment guide
- **backend/routes/** - API endpoint documentation
- **frontend/src/pages/** - Page components

---

## 🆘 Need Help?

1. Check console logs for errors
2. Review environment variables
3. Test API endpoints individually
4. Check MongoDB Atlas dashboard
5. Review Gemini API quota

---

**Happy Learning! 🎓**
