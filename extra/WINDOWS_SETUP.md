# 🪟 Windows Setup Instructions for AI-Learn

## Prerequisites Installation

### 1. Install Node.js
1. Download from [nodejs.org](https://nodejs.org/) (LTS version 18+)
2. Run installer and follow prompts
3. Verify installation:
```powershell
node --version
npm --version
```

### 2. Install Python
1. Download from [python.org](https://www.python.org/downloads/) (3.8+)
2. **Important**: Check "Add Python to PATH" during installation
3. Verify installation:
```powershell
python --version
pip --version
```

### 3. Install Git (Optional)
1. Download from [git-scm.com](https://git-scm.com/)
2. Run installer with default options
3. Verify:
```powershell
git --version
```

---

## Complete Setup Process

### Step 1: Navigate to Project
```powershell
cd c:\Users\khush\Desktop\project\AI-Learn
```

### Step 2: Backend Setup
```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
Copy-Item .env.example .env

# Edit .env file
notepad .env
```

Add your credentials to `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string_here
SESSION_SECRET=your_random_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
ML_SERVICE_URL=http://localhost:5001
CORS_ORIGIN=http://localhost:3000
```

### Step 3: ML Service Setup
```powershell
# Navigate to ML service (from backend folder)
cd ..\ml_service

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# You should see (venv) in your prompt now

# Install dependencies
pip install -r requirements.txt

# Create environment file
Copy-Item .env.example .env

# Train the ML model
python train_model.py

# Expected output:
# 🤖 AI-Learn ML Model Training
# ✅ Model trained successfully!
# Accuracy: 95.00%
```

### Step 4: Frontend Setup
```powershell
# Deactivate venv if still active
deactivate

# Navigate to frontend (from ml_service folder)
cd ..\frontend

# Install dependencies
npm install

# Create environment file
Copy-Item .env.example .env.local

# Edit .env.local
notepad .env.local
```

Add to `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Running the Application

You'll need **3 separate PowerShell windows**.

### Window 1: Backend Server
```powershell
cd c:\Users\khush\Desktop\project\AI-Learn\backend
npm run dev
```

**Expected output:**
```
✅ MongoDB Connected: cluster.mongodb.net
🚀 Server running on port 5000
📚 Environment: development
```

Keep this window open!

### Window 2: ML Service
```powershell
cd c:\Users\khush\Desktop\project\AI-Learn\ml_service
venv\Scripts\activate
python app.py
```

**Expected output:**
```
✅ Model loaded successfully from ./model.pkl
🚀 Starting ML Service on port 5001
 * Running on http://0.0.0.0:5001
```

Keep this window open!

### Window 3: Frontend
```powershell
cd c:\Users\khush\Desktop\project\AI-Learn\frontend
npm run dev
```

**Expected output:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Keep this window open!

---

## Testing the Application

1. Open your browser
2. Go to: http://localhost:3000
3. Click "Get Started Free"
4. Register a new account
5. Take a quiz
6. View your dashboard

---

## Stopping the Services

To stop a service:
1. Click on its PowerShell window
2. Press `Ctrl + C`
3. Confirm with `Y` if asked

To stop all services:
- Press `Ctrl + C` in each of the 3 windows

---

## Common Windows-Specific Issues

### Issue: "python" not recognized
**Solution:**
```powershell
# Check if Python is installed
where python

# If not found, add to PATH:
# 1. Search "Environment Variables" in Windows
# 2. Edit "Path" in System Variables
# 3. Add: C:\Users\<YourName>\AppData\Local\Programs\Python\Python311
# 4. Restart PowerShell
```

### Issue: "cannot be loaded because running scripts is disabled"
**Solution:**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try activating venv again
```

### Issue: Port already in use
**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace <PID> with actual number)
taskkill /PID <PID> /F

# Example:
# netstat -ano | findstr :5000
# Output: TCP  0.0.0.0:5000  0.0.0.0:0  LISTENING  12345
# taskkill /PID 12345 /F
```

### Issue: npm install fails
**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Install again
npm install
```

### Issue: Virtual environment activation fails
**Solution:**
```powershell
# Make sure you're in ml_service directory
cd c:\Users\khush\Desktop\project\AI-Learn\ml_service

# Try alternative activation
.\venv\Scripts\Activate.ps1

# If still fails, create new venv
Remove-Item -Recurse -Force venv
python -m venv venv
venv\Scripts\activate
```

---

## Useful PowerShell Commands

### Check if services are running
```powershell
# Check backend (should show process if running)
netstat -ano | findstr :5000

# Check ML service
netstat -ano | findstr :5001

# Check frontend
netstat -ano | findstr :3000
```

### Open project in VS Code
```powershell
cd c:\Users\khush\Desktop\project\AI-Learn
code .
```

### View logs in real-time
The logs will appear automatically in each PowerShell window where you started the service.

---

## Setting Up MongoDB Atlas (Windows)

1. Open browser: https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create new cluster (M0 Free tier)
4. Wait 3-5 minutes for cluster creation
5. Database Access → Add New Database User:
   - Username: `ai-learn-admin`
   - Password: (generate strong password)
   - Save password in safe place!
6. Network Access → Add IP Address:
   - Choose "Allow Access from Anywhere"
   - IP: `0.0.0.0/0`
7. Database → Connect → Connect your application
8. Copy connection string
9. Replace `<password>` with your actual password
10. Paste into `backend\.env` as `MONGODB_URI`

---

## Setting Up Google Gemini API (Windows)

1. Open browser: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Click "Create API key in new project"
5. Copy the API key (starts with `AIza...`)
6. Paste into `backend\.env` as `GEMINI_API_KEY`

⚠️ **Never share your API key publicly!**

---

## Quick Reference

### Start All Services (After First Setup)

**PowerShell Window 1:**
```powershell
cd c:\Users\khush\Desktop\project\AI-Learn\backend; npm run dev
```

**PowerShell Window 2:**
```powershell
cd c:\Users\khush\Desktop\project\AI-Learn\ml_service; venv\Scripts\activate; python app.py
```

**PowerShell Window 3:**
```powershell
cd c:\Users\khush\Desktop\project\AI-Learn\frontend; npm run dev
```

### Project URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- ML Service: http://localhost:5001

---

## Troubleshooting Checklist

Before asking for help, check:

- [ ] All 3 services are running (3 PowerShell windows)
- [ ] MongoDB Atlas cluster is active
- [ ] MongoDB connection string is correct in `backend\.env`
- [ ] Gemini API key is correct in `backend\.env`
- [ ] ML model is trained (`ml_service\model.pkl` exists)
- [ ] Virtual environment is activated (for ML service)
- [ ] No port conflicts (5000, 5001, 3000 are free)
- [ ] Internet connection is working
- [ ] Firewall is not blocking connections

---

## Getting Help

If you're stuck:

1. Check the error message in PowerShell
2. Read the error carefully - it often tells you what's wrong
3. Check the troubleshooting section above
4. Google the error message
5. Check MongoDB Atlas dashboard for connection issues
6. Verify API keys are valid and have quota

---

## Next Steps After Setup

✅ Application is running locally  
✅ All services are working

Now you can:
1. 📚 Take quizzes on different topics
2. 📊 Build your learning profile
3. 🤖 Get AI-powered recommendations
4. 🚀 Deploy to production (see DEPLOYMENT.md)

---

**Congratulations on setting up AI-Learn on Windows! 🎉**
