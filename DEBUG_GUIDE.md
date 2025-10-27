# 🔍 Session Debug Guide - Find Out Why Cookies Aren't Working

## What We Just Did

Added **extensive debug logging** to the backend (commit `a1bed9d`) to see exactly what's happening with sessions.

---

## 🎯 STEPS TO DEBUG (Do These Now!)

### Step 1: Wait for Render Redeploy (3-5 min) ⏰

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click on **`ai-learn-backend`**
3. Go to **"Logs"** tab
4. Wait for:
   ```
   ==> Build successful!
   🚀 Server running on port 5000
   📚 Environment: production
   ```

### Step 2: Keep Logs Tab Open 📋

**IMPORTANT**: Keep the Render logs tab open while testing!

### Step 3: Test Registration & Watch Logs 🧪

1. **Clear cookies** or use **incognito mode**
2. Open `https://ai-learn-frontend.vercel.app`
3. Open **two browser tabs**:
   - Tab 1: Your frontend
   - Tab 2: Render logs (from Step 1)

4. **Register** with a new email

5. **Watch Render logs** - you should see:

```
🔍 Request: POST /auth/register
🔍 Origin: https://ai-learn-frontend.vercel.app
🔍 Session ID: <some-id>
🔍 Session Data: Session {}
✅ Registration - Creating session for user: <user-id>
✅ Session before save: Session { cookie: {...}, userId: <user-id>, role: 'user' }
✅ Session saved successfully
✅ Session ID: <session-id>
```

Then immediately:

```
🔍 Request: GET /auth/me
🔍 Origin: https://ai-learn-frontend.vercel.app
🔍 Session ID: <same-session-id-as-above>
🔍 Session Data: Session { cookie: {...}, userId: <user-id>, role: 'user' }
```

---

## 📊 What The Logs Tell Us

### ✅ GOOD Signs (Session Working):

1. **Same Session ID** in both `/auth/register` and `/auth/me`
2. **Session Data has userId** in the `/auth/me` request
3. **No errors** about session save

### ❌ BAD Signs (Session Broken):

#### Problem 1: Different Session IDs
```
POST /auth/register - Session ID: abc123
GET /auth/me - Session ID: xyz789  ❌ DIFFERENT!
```
**Meaning**: Cookie not being sent by browser  
**Cause**: Cookie settings wrong OR browser rejecting cookie

#### Problem 2: Empty Session on /auth/me
```
POST /auth/register - Session Data: { userId: '...' }  ✅
GET /auth/me - Session Data: {}  ❌ EMPTY!
```
**Meaning**: Session not persisted to MongoDB  
**Cause**: MongoDB connection issue OR session store error

#### Problem 3: No /auth/me Request at All
```
POST /auth/register  ✅
(nothing else)
```
**Meaning**: Frontend not calling `/auth/me`  
**Cause**: Frontend error (check browser console)

---

## 🔍 Browser DevTools Check

While registering, also check browser DevTools:

### Network Tab
1. Press `F12` → **Network** tab
2. Register
3. Find `POST /auth/register` request
4. Click on it → **Headers** tab
5. Scroll to **Response Headers**

**Look for**:
```
Set-Cookie: connect.sid=s%3A...; Path=/; Expires=...; HttpOnly; Secure; SameSite=None
```

**If missing**: Backend didn't send cookie (MongoDB issue)  
**If present**: Cookie sent, but browser rejected it

### Application Tab
1. Press `F12` → **Application** tab
2. **Cookies** → `https://ai-learn-backend.onrender.com`

**Should see**:
```
Name: connect.sid
Value: s%3A...
Domain: .onrender.com
Path: /
Expires: (7 days from now)
HttpOnly: ✓
Secure: ✓
SameSite: None
```

**If missing**: Browser rejected cookie

---

## 🐛 Diagnosis Decision Tree

Based on logs + DevTools:

### Scenario A: Set-Cookie Present, Cookie Saved, Same Session ID
**Status**: Everything working!  
**But**: Still getting 401?  
**Check**: Is `requireAuth` middleware working?  
**Action**: Check middleware logs

### Scenario B: Set-Cookie Present, Cookie NOT Saved
**Status**: Browser rejecting cookie  
**Reasons**:
1. **Insecure context** (but Vercel/Render use HTTPS ✅)
2. **SameSite mismatch** (should be `None`)
3. **Browser privacy settings** (try different browser)
4. **Browser extension** (ad blocker, privacy tool)

**Action**: Try different browser or incognito mode

### Scenario C: Set-Cookie MISSING
**Status**: Backend not creating session  
**Reasons**:
1. **MongoDB not connected**
2. **Session store error**
3. **Code error preventing session.save()**

**Action**: Check Render logs for MongoDB errors:
```
MongooseServerSelectionError
MongoError
Session save error
```

### Scenario D: Different Session IDs
**Status**: Cookie not being sent with request  
**Same as Scenario B** - browser rejecting cookie

---

## 🆘 Based on Logs, Do This:

### If Logs Show MongoDB Error:
```bash
# In Render backend logs
MongooseServerSelectionError: Could not connect to any servers
```

**Fix**:
1. Check `MONGODB_URI` in Render environment variables
2. Check MongoDB Atlas → Network Access → Verify `0.0.0.0/0`
3. Check MongoDB Atlas → Database Access → Verify user exists
4. Try connection string locally to test

### If Logs Show Session Save Error:
```bash
❌ Session save error: <error message>
```

**Fix**: Read error message, likely:
- MongoDB connection lost
- Invalid session data
- Disk space (unlikely on Render)

### If Logs Show Session Created But userId Missing Later:
```bash
POST /auth/register - userId: 123  ✅
GET /auth/me - userId: undefined  ❌
```

**Fix**: Session not retrieved from MongoDB store
- Check MongoDB connection
- Check MongoStore configuration
- Try adding `touchAfter` delay

### If No Logs Appear At All:
**Issue**: Backend not receiving requests  
**Fix**:
1. Verify `NEXT_PUBLIC_API_URL` in Vercel points to correct backend URL
2. Check browser console for CORS errors
3. Check if backend is sleeping (visit `/health` to wake it)

---

## 📸 What to Send Me

After you test registration, send me:

1. **Render backend logs** (copy last 50 lines after registration)
2. **Browser console** (any errors?)
3. **Network tab screenshot** of `POST /auth/register` response headers
4. **Application tab screenshot** of cookies for `onrender.com`

This will tell us EXACTLY what's wrong!

---

## ⏱️ Timeline

- **Now**: Code pushed (commit `a1bed9d`) with debug logging
- **+2 min**: Render starts building
- **+5 min**: Deploy complete → **TEST & SEND LOGS**

---

## 💡 What We're Looking For

The logs will reveal one of these issues:

1. **MongoDB connection broken** → Fix connection string
2. **Cookie being set but browser rejecting** → Try different browser
3. **Session created but not retrieved** → MongoStore config issue
4. **Frontend not calling backend correctly** → Check API URL
5. **CORS blocking requests** → Fix CORS_ORIGIN

**We WILL figure this out! 🔍**
