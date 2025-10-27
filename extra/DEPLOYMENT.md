# 🚀 Deployment Guide for AI-Learn Platform

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Google Gemini API Key](#google-gemini-api-key)
4. [Backend Deployment (Render)](#backend-deployment-render)
5. [ML Service Deployment (Render)](#ml-service-deployment-render)
6. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
7. [Post-Deployment Testing](#post-deployment-testing)

---

## Prerequisites

- GitHub account
- MongoDB Atlas account (free tier)
- Google AI Studio account for Gemini API
- Vercel account (free)
- Render account (free)

---

## MongoDB Atlas Setup

### 1. Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **"Create a New Cluster"**
4. Choose **FREE** tier (M0 Sandbox)
5. Select cloud provider and region (choose one closest to you)
6. Name your cluster (e.g., `ai-learn-cluster`)
7. Click **"Create Cluster"** (takes 3-5 minutes)

### 2. Create Database User

1. Go to **Database Access** in left sidebar
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Username: `ai-learn-admin` (or your choice)
5. Password: Generate a strong password (save it!)
6. Database User Privileges: **Read and write to any database**
7. Click **"Add User"**

### 3. Whitelist IP Addresses

1. Go to **Network Access** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - IP Address: `0.0.0.0/0`
4. Click **"Confirm"**

### 4. Get Connection String

1. Go to **Database** in left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your credentials
6. Save this for backend deployment

---

## Google Gemini API Key

### 1. Get API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click **"Create API Key"**
4. Click **"Create API key in new project"**
5. Copy the API key (starts with `AIza...`)
6. Save this for backend deployment

⚠️ **Important**: Keep this key secret!

---

## Backend Deployment (Render)

### 1. Push Code to GitHub

```bash
cd AI-Learn
git init
git add .
git commit -m "Initial commit: AI-Learn Platform"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure service:
   - **Name**: `ai-learn-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 3. Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=<your-mongodb-connection-string>
SESSION_SECRET=<generate-random-string-32-chars>
GEMINI_API_KEY=<your-gemini-api-key>
ML_SERVICE_URL=<will-add-after-ml-service-deployed>
CORS_ORIGIN=<will-add-after-frontend-deployed>
```

Generate session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. Click **"Create Web Service"**
5. Wait for deployment (5-10 minutes)
6. Copy the service URL (e.g., `https://ai-learn-backend.onrender.com`)

---

## ML Service Deployment (Render)

### 1. Deploy Flask Service

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Select same GitHub repository
3. Configure service:
   - **Name**: `ai-learn-ml-service`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Root Directory**: `ml_service`
   - **Runtime**: `Python 3` (will automatically use Python 3.11 from runtime.txt)
   - **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt && python train_model.py`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT app:app`
   - **Instance Type**: `Free`

### 2. Add Environment Variables

```
PORT=5001
FLASK_ENV=production
MODEL_PATH=./model.pkl
```

**Important**: Render automatically sets `PORT`, but we include it for clarity.

3. Click **"Create Web Service"**
4. Wait for deployment
5. Copy the ML service URL (e.g., `https://ai-learn-ml-service.onrender.com`)

### 3. Update Backend Environment

1. Go back to backend service in Render
2. Environment → **"ML_SERVICE_URL"** → `<your-ml-service-url>`
3. Click **"Save Changes"** (will trigger redeploy)

---

## Frontend Deployment (Vercel)

### 1. Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2. Add Environment Variables

Click **"Environment Variables"**:

```
NEXT_PUBLIC_API_URL=<your-backend-url>
```

Example: `https://ai-learn-backend.onrender.com`

3. Click **"Deploy"**
4. Wait for deployment (3-5 minutes)
5. Copy the deployment URL (e.g., `https://ai-learn.vercel.app`)

### 3. Update Backend CORS

1. Go back to Render backend service
2. Environment → **"CORS_ORIGIN"** → `<your-vercel-url>`
3. Click **"Save Changes"**

---

## Post-Deployment Testing

### 1. Test Backend

```bash
curl https://your-backend-url.onrender.com/health
```

Expected response:
```json
{"status":"OK","message":"AI-Learn Backend is running!"}
```

### 2. Test ML Service

```bash
curl https://your-ml-service-url.onrender.com/health
```

Expected response:
```json
{"status":"OK","message":"ML Service is running","model_loaded":true}
```

### 3. Test Frontend

1. Open `https://your-frontend-url.vercel.app`
2. Click **"Get Started Free"**
3. Register a new account
4. Login and go to dashboard
5. Take a quiz
6. Analyze progress

---

## Environment Variables Summary

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-learn?retryWrites=true&w=majority
SESSION_SECRET=your_32_char_random_string
GEMINI_API_KEY=your_gemini_api_key
ML_SERVICE_URL=https://your-ml-service.onrender.com
CORS_ORIGIN=https://your-frontend.vercel.app
```

### ML Service (.env)
```env
PORT=5001
FLASK_ENV=production
MODEL_PATH=./model.pkl
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## Troubleshooting

### Issue: Python/Cython compilation errors in ML service
**Error**: `'int_t' is not a type identifier` or scikit-learn build failures
**Solution**: 
- Ensure `runtime.txt` exists in `ml_service/` folder with content: `python-3.11.10`
- Python 3.13 is not yet fully supported by scikit-learn
- See `extra/ML_SERVICE_FIX.md` for detailed fix

### Issue: Backend timing out
**Solution**: Render free tier sleeps after 15 min of inactivity. First request takes 30-60s to wake up.

### Issue: ML model not loading
**Solution**: Check build logs. Ensure `train_model.py` ran successfully during build.

### Issue: CORS errors
**Solution**: Verify `CORS_ORIGIN` matches exact Vercel URL (no trailing slash).

### Issue: Session not persisting
**Solution**: Ensure MongoDB connection string is correct and cluster is active.

### Issue: Quiz generation fails
**Solution**: Verify Gemini API key is valid and has quota remaining.

---

## Cost Breakdown (Free Tier Limits)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **MongoDB Atlas** | 512 MB storage | Shared cluster |
| **Render (Backend)** | 750 hours/month | Sleeps after inactivity |
| **Render (ML Service)** | 750 hours/month | Sleeps after inactivity |
| **Vercel** | Unlimited deployments | 100 GB bandwidth |
| **Gemini API** | 60 requests/minute | Free tier |

**Total Monthly Cost**: $0 (within limits)

---

## Scaling to Production

When you're ready to scale:

1. **MongoDB Atlas**: Upgrade to M10+ for dedicated cluster
2. **Render**: Upgrade to paid plan for always-on instances
3. **Vercel**: Pro plan for team features
4. **Gemini API**: Pay-as-you-go for higher limits
5. **Redis**: Add for session storage (better than MongoDB)
6. **CDN**: Add Cloudflare for static assets

---

## Security Checklist

- ✅ Environment variables set correctly
- ✅ MongoDB IP whitelist configured
- ✅ HTTPS enabled on all services
- ✅ API keys not committed to Git
- ✅ CORS restricted to frontend domain
- ✅ Session secret is strong and random
- ✅ Password hashing enabled (bcrypt)

---

## Support

If you encounter issues:

1. Check service logs in Render/Vercel dashboards
2. Review MongoDB Atlas logs
3. Test API endpoints with Postman
4. Check browser console for frontend errors

---

**Congratulations! Your AI-Learn platform is now live! 🎉**
