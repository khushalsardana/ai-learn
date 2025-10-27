# � Deployment Troubleshooting Guide

## 🚨 CURRENT ISSUE: 401 Session Cookie Error

### Problem
After registration/login, the frontend keeps getting **401 errors** when calling `/auth/me`, causing an infinite redirect loop back to the login page.

---

## ✅ Fixes Applied (Just Pushed)

### Fix 1: CORS Origin - ✅ COMPLETED
Updated `CORS_ORIGIN` to correct Vercel URL

### Fix 2: Cookie Configuration - ✅ COMPLETED  
Set `secure: true` and `sameSite: 'none'` for cross-origin cookies

### Fix 3: Explicit Session Save - ⏳ DEPLOYING NOW
Added `req.session.save()` callback in register/login routes  
**Commit**: `1db71fb` - **WAIT FOR RENDER REDEPLOY**

---

## 🎯 WHAT TO DO NOW (STEP BY STEP)

### Step 1: Wait for Render Redeploy (3-5 minutes) ⏰

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **`ai-learn-backend`** service  
3. Click **"Logs"** tab
4. Wait for:
   ```
   ==> Build successful!
   🚀 Server running on port 5000
   ```

### Step 2: CLEAR ALL COOKIES (CRITICAL!) 🍪

**Option A: Use Incognito Mode** (Easiest):
- `Ctrl + Shift + N` (Chrome/Edge)
- `Ctrl + Shift + P` (Firefox)

**Option B: Clear Cookies Manually**:
1. Press `F12` → **Application** tab
2. **Cookies** → Delete ALL for:
   - `https://ai-learn-frontend.vercel.app`
   - `https://ai-learn-backend.onrender.com`

### Step 3: Test Registration 🧪

1. Open `https://ai-learn-frontend.vercel.app` (incognito)
2. Open DevTools (`F12`) → **Network** tab
3. Register with **NEW email**
4. Watch for:
   - `POST /auth/register` → Status **201** ✅
   - Response has `Set-Cookie: connect.sid=...; Secure; SameSite=None` ✅
   - `GET /auth/me` → Status **200** (NOT 401!) ✅
   - Request has `Cookie: connect.sid=...` ✅

---

## 🔍 Debugging Checklist

### Check Render Environment Variables
```
CORS_ORIGIN = https://ai-learn-frontend.vercel.app (EXACT match!)
SESSION_SECRET = (32+ characters)
MONGODB_URI = mongodb+srv://...
NODE_ENV = production
```

### Verify Response Headers (Network Tab)
After `POST /auth/register`:
```
✅ Set-Cookie: connect.sid=...; HttpOnly; Secure; SameSite=None
✅ Access-Control-Allow-Origin: https://ai-learn-frontend.vercel.app
✅ Access-Control-Allow-Credentials: true
```

### Verify Request Headers (Network Tab)  
After registration, `GET /auth/me`:
```
✅ Cookie: connect.sid=...
✅ Origin: https://ai-learn-frontend.vercel.app
```

---

## 🐛 Common Issues

### Issue: Still Getting 401
**Solution**:
1. Clear cookies completely (try incognito)
2. Wait for Render redeploy to finish
3. Check Render logs for errors
4. Verify MongoDB is connected

### Issue: No Set-Cookie Header
**Solution**:
1. Check Render logs for MongoDB errors
2. Verify `MONGODB_URI` is correct
3. Check MongoDB Atlas cluster is active

### Issue: Cookie Not Sent with Requests
**Solution**:
1. Verify `SameSite=None` in Set-Cookie header
2. Clear old cookies (old `SameSite=Lax` conflicts)
3. Use incognito mode

---

## 📊 Expected Behavior After Fix

✅ No 401 errors in console  
✅ No infinite redirect loop  
✅ Dashboard loads after registration  
✅ Refreshing page keeps you logged in  
✅ Can navigate between pages  

---

## ⏱️ Timeline

- **Now**: Code pushed (commit `1db71fb`)
- **+2 min**: Render starts build
- **+5 min**: New code is LIVE → **TEST NOW**

---

## 📝 Previous Issues (RESOLVED)

### ✅ ML Service Python Error (FIXED)
```
'int_t' is not a type identifier
AttributeError: 'ErrorType' object has no attribute 'rank'
```

**Root Cause**: Render used Python 3.13 by default, but scikit-learn doesn't support it yet.

---

## ✅ Solution Applied

I've created/modified these files to fix the issue:

### 1. `ml_service/runtime.txt` (NEW)
```
python-3.11.10
```
This tells Render to use Python 3.11 instead of 3.13.

### 2. `ml_service/requirements.txt` (UPDATED)
- Added comments about Python version requirement
- Made version ranges more flexible

### 3. `extra/DEPLOYMENT.md` (UPDATED)
- Updated ML service build command
- Added troubleshooting for this specific error

### 4. `extra/ML_SERVICE_FIX.md` (NEW)
- Detailed explanation and fix guide

---

## 🎯 What You Need to Do Now

### Step 1: Commit and Push the Fix

```bash
# The files are already staged, just commit
git commit -m "Fix: Specify Python 3.11 for ML service to resolve scikit-learn compilation errors"

# Push to GitHub
git push origin main
```

### Step 2: Render Will Auto-Deploy

Once you push, Render will automatically:
1. Detect the new `runtime.txt` file
2. Use Python 3.11.10 instead of 3.13
3. Successfully compile scikit-learn
4. Train the model
5. Start the service

### Step 3: Monitor the Build

1. Go to your Render dashboard
2. Open the ML service
3. Watch the build logs
4. Look for:
   ```
   ==> Using Python version 3.11.10
   Successfully installed scikit-learn-1.x.x
   ✅ Model trained successfully
   ```

---

## 📋 Files Changed

```
Changes to be committed:
  modified:   extra/DEPLOYMENT.md
  new file:   extra/ML_SERVICE_FIX.md
  modified:   ml_service/requirements.txt
  new file:   ml_service/runtime.txt
```

---

## 🔍 Why This Happened

| Component | Version | Issue |
|-----------|---------|-------|
| Render Default | Python 3.13.4 | Latest Python |
| scikit-learn | 1.3.2 - 1.5.x | Not compatible with Python 3.13 |
| Cython | Used by sklearn | Compilation errors on Python 3.13 |
| **Solution** | **Python 3.11.10** | **Fully supported by scikit-learn** |

---

## ✅ After Deployment

Your ML service should successfully:
- ✅ Install all dependencies
- ✅ Train the Random Forest model
- ✅ Start the Flask server
- ✅ Respond on port 5001
- ✅ Provide prediction endpoints

---

## 🎉 Summary

**Status**: Ready to push!

**Commands**:
```bash
git commit -m "Fix: Specify Python 3.11 for ML service"
git push origin main
```

**Expected Result**: ML service will deploy successfully on Render with Python 3.11.

---

**This should completely resolve your deployment error!** 🚀
