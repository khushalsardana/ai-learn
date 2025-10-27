# 🔐 Environment Variables Setup Guide

## ⚠️ IMPORTANT SECURITY NOTICE

**NEVER commit `.env` files to GitHub!** They contain sensitive credentials that should remain private.

---

## 📝 How to Update Your Keys Safely

### Step 1: Update Keys in Local `.env` Files

#### Backend (.env)
Location: `backend/.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>

# Session Secret (Generate a random strong string)
SESSION_SECRET=<your-strong-random-secret>

# Google Gemini API
GEMINI_API_KEY=<your-new-gemini-api-key>

# ML Service URL
ML_SERVICE_URL=http://localhost:5001

# CORS Origin (Frontend URL)
CORS_ORIGIN=http://localhost:3000
```

**Replace these with your new values:**
- `MONGODB_URI` - Your new Atlas cluster connection string
- `GEMINI_API_KEY` - Your new Gemini API key
- `SESSION_SECRET` - Generate a strong random string (at least 32 characters)

#### Frontend (.env.local)
Location: `frontend/.env.local`

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### ML Service (.env)
Location: `ml_service/.env`

```env
# Model Configuration
MODEL_PATH=./model.pkl

# Server Configuration
PORT=5001
```

---

### Step 2: Verify `.env` is Ignored by Git

Run this command to check:
```bash
git status
```

✅ Your `.env` should NOT appear in the list  
✅ Only `.env.example` files should be staged

---

### Step 3: Update `.env.example` Files (Safe to Commit)

These are templates that show what variables are needed without actual values.

#### Update `backend/.env.example`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string_here

# Session Secret
SESSION_SECRET=your_session_secret_here

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# ML Service URL
ML_SERVICE_URL=http://localhost:5001

# CORS Origin (Frontend URL)
CORS_ORIGIN=http://localhost:3000
```

---

## 🚀 Deployment: Where to Add Your Keys

### For Production Deployment:

#### 1. Vercel (Frontend)
- Go to your project settings
- Navigate to "Environment Variables"
- Add: `NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app`

#### 2. Railway/Render (Backend)
- Go to your service settings
- Navigate to "Environment Variables" or "Variables"
- Add all variables from `backend/.env`:
  - `PORT=5000`
  - `NODE_ENV=production`
  - `MONGODB_URI=<your-atlas-connection-string>`
  - `SESSION_SECRET=<strong-random-secret>`
  - `GEMINI_API_KEY=<your-api-key>`
  - `ML_SERVICE_URL=<your-ml-service-url>`
  - `CORS_ORIGIN=<your-vercel-frontend-url>`

#### 3. Railway/Render (ML Service)
- Add variables from `ml_service/.env`:
  - `PORT=5001`
  - `MODEL_PATH=./model.pkl`

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` in `.gitignore` (already done)
- Use environment variables in deployment platforms
- Generate strong random secrets for production
- Use different credentials for development and production
- Share only `.env.example` files in GitHub
- Rotate keys if accidentally exposed

### ❌ DON'T:
- Commit `.env` files to Git
- Share API keys in chat/email
- Use the same credentials for dev and production
- Hardcode secrets in your source code
- Share your MongoDB password publicly

---

## 🛡️ What If Keys Were Accidentally Exposed?

If you accidentally committed your `.env`:

1. **Immediately revoke/regenerate all keys:**
   - MongoDB Atlas: Reset database password
   - Gemini API: Delete and create new API key

2. **Remove from Git history:**
   ```bash
   # Remove file from Git history
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch backend/.env" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (WARNING: This rewrites history)
   git push origin --force --all
   ```

3. **Update all deployment platforms** with new credentials

---

## 📋 Pre-Commit Checklist

Before running `git commit`:

- [ ] Check `git status` - ensure no `.env` files are listed
- [ ] Verify `.env.example` files are updated with template values (no real keys)
- [ ] Run `git diff` to review changes
- [ ] Ensure all sensitive data is in environment variables only

---

## 🎯 Summary

**Local Development:**
- ✅ Update actual keys in `backend/.env` (NOT committed)
- ✅ Update actual keys in `frontend/.env.local` (NOT committed)
- ✅ These files are ignored by Git

**GitHub Repository:**
- ✅ Only commit `.env.example` files with placeholder values
- ✅ Real keys stay on your computer and deployment platforms

**Deployment:**
- ✅ Add real keys to deployment platform's environment variables
- ✅ Different credentials for production than development

---

## 🆘 Need to Generate Strong Secrets?

### For SESSION_SECRET (Node.js):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Or use online generator:
- https://randomkeygen.com/ (use "Fort Knox Password")

---

**Your keys are safe as long as they stay in `.env` files and deployment platforms!** 🔐
