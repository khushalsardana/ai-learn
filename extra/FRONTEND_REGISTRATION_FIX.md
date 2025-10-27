# 🔧 Frontend Registration Failed - Troubleshooting Guide

## 🔴 Problem: "Registration Failed. Try Again Later"

This error occurs when the frontend can't communicate with the backend API.

---

## 🔍 Diagnosis Steps

### Step 1: Check if Backend is Running

Open your browser and visit:
```
https://your-backend-url.onrender.com/api/auth/check
```

**Expected Response:**
```json
{
  "authenticated": false
}
```

**If you get an error or timeout:**
- ❌ Backend is not deployed or sleeping
- ❌ Wrong backend URL in frontend

---

### Step 2: Check Browser Console

1. Open your Vercel frontend site
2. Press **F12** (Developer Tools)
3. Go to **Console** tab
4. Try to register again
5. Look for errors

**Common Errors:**

#### Error 1: CORS Error
```
Access to fetch at 'https://backend.onrender.com/api/auth/register' 
from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```

**Solution:** Backend CORS_ORIGIN is wrong

#### Error 2: Network Error / Failed to Fetch
```
POST https://backend.onrender.com/api/auth/register net::ERR_CONNECTION_REFUSED
```

**Solution:** Backend is down or URL is wrong

#### Error 3: 404 Not Found
```
POST https://backend.onrender.com/api/auth/register 404 (Not Found)
```

**Solution:** Backend route doesn't exist or backend not deployed

---

## ✅ Solutions

### Solution 1: Verify Backend URL in Vercel

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Check `NEXT_PUBLIC_API_URL`

**Should be:**
```
https://ai-learn-backend.onrender.com
```

**NOT:**
```
http://localhost:5000  ❌ (Wrong!)
https://ai-learn-backend.onrender.com/  ❌ (No trailing slash!)
```

If wrong:
1. Update the variable
2. **Redeploy** the frontend (Vercel → Deployments → Redeploy)

---

### Solution 2: Fix Backend CORS

1. Go to **Render Dashboard** → Backend Service
2. Click **Environment** tab
3. Check `CORS_ORIGIN`

**Should be:**
```
https://your-app.vercel.app
```

**NOT:**
```
http://localhost:3000  ❌ (Wrong!)
https://your-app.vercel.app/  ❌ (No trailing slash!)
```

If wrong:
1. Update the variable
2. Click **Save Changes** (backend will redeploy)

---

### Solution 3: Wake Up Backend (Free Tier Sleep)

Render free tier services sleep after 15 minutes of inactivity.

**To wake it up:**
1. Visit: `https://your-backend-url.onrender.com/api/auth/check`
2. Wait 30-60 seconds (it's starting up)
3. Try registration again

**Permanent solution:** Upgrade to Render paid plan ($7/month)

---

### Solution 4: Check Backend Deployment Status

1. Go to **Render Dashboard** → Backend Service
2. Check the status badge

**If it says:**
- ✅ **"Live"** → Backend is running
- ⚠️ **"Building"** → Wait for deployment to complete
- ❌ **"Failed"** → Check logs for errors

---

## 🧪 Test Backend Manually

### Test 1: Health Check
```bash
curl https://your-backend-url.onrender.com/api/auth/check
```

**Expected:**
```json
{"authenticated":false}
```

### Test 2: Registration Endpoint
```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected:**
```json
{
  "message": "User created successfully"
}
```

**If you get an error**, check the backend logs in Render.

---

## 📋 Quick Checklist

- [ ] Backend is deployed and showing "Live" in Render
- [ ] Backend URL is correct in Vercel: `NEXT_PUBLIC_API_URL`
- [ ] Frontend URL is correct in Render backend: `CORS_ORIGIN`
- [ ] No trailing slashes in URLs
- [ ] Backend woke up from sleep (visit URL first)
- [ ] MongoDB is connected (check backend logs)
- [ ] Browser console shows no CORS errors

---

## 🎯 Most Common Issues

| Issue | Symptom | Fix |
|-------|---------|-----|
| **Wrong Backend URL** | Network error | Update `NEXT_PUBLIC_API_URL` in Vercel |
| **CORS Blocked** | CORS policy error | Update `CORS_ORIGIN` in Render backend |
| **Backend Sleeping** | Timeout after 30s | Visit backend URL to wake it up |
| **Backend Failed** | 502/503 errors | Check backend logs, redeploy |
| **MongoDB Down** | 500 errors | Check MongoDB Atlas cluster status |

---

## 🔍 Debug Process

1. **Open Browser DevTools** (F12)
2. **Go to Network tab**
3. **Try to register**
4. **Look at the failed request:**
   - **Status Code**:
     - 0 = CORS issue or backend down
     - 404 = Wrong route
     - 500 = Backend error
     - 502/503 = Backend not responding
   - **Response**:
     - Check error message
5. **Go to Console tab**:
   - Look for CORS errors

---

## ✅ After Fixing

1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Try registration again

---

**Most likely issue: Backend is sleeping (free tier) or CORS_ORIGIN is not set correctly.**

Visit your backend URL first to wake it up, then try registration!
