# 🔧 URGENT FIX: Port Binding Issue on Render

## 🔴 Problem

Your ML service has been "deploying" for 2+ hours because:

**Render is expecting**: Dynamic port from `$PORT` environment variable
**Your service is using**: Fixed port 5001

This mismatch causes Render to never mark the service as "live".

---

## ✅ SOLUTION: Fix the Start Command

### Go to Render Dashboard:

1. **Open your ML Service** in Render
2. Click **"Settings"** (left sidebar)
3. Find **"Start Command"**

### Current (WRONG):
```bash
gunicorn --bind 0.0.0.0:5001 app:app
```

### Change to (CORRECT):
```bash
gunicorn --bind 0.0.0.0:$PORT app:app
```

4. Click **"Save Changes"**
5. Service will auto-redeploy

---

## 📝 Environment Variables

Also check your **Environment** tab:

### Remove these if they exist:
- ❌ `FLASK_PORT=5001` (not needed)
- ❌ `PORT=5001` (Render sets this automatically)

### Keep only these:
- ✅ `FLASK_ENV=production`
- ✅ `MODEL_PATH=./model.pkl`

**Important**: Render automatically sets `PORT` to a random available port. Don't hardcode it!

---

## 🚀 What Will Happen After Fix

Once you update the start command to use `$PORT`:

```
==> Running 'gunicorn --bind 0.0.0.0:$PORT app:app'
[INFO] Starting gunicorn 22.0.0
[INFO] Listening at: http://0.0.0.0:10000 (example port)
✅ Model loaded successfully
127.0.0.1 - - "HEAD / HTTP/1.1" 200 0
==> Detected service running on port 10000
==> Your service is live 🎉
```

**Deploy time**: 2-3 minutes

---

## 🎯 Quick Checklist

- [ ] Go to Render → ML Service → Settings
- [ ] Update Start Command to: `gunicorn --bind 0.0.0.0:$PORT app:app`
- [ ] Remove hardcoded `PORT` or `FLASK_PORT` from Environment variables
- [ ] Keep only `FLASK_ENV=production` and `MODEL_PATH=./model.pkl`
- [ ] Click Save Changes
- [ ] Wait 2-3 minutes for redeploy

---

## 📊 Why This Happens

| Component | What It Expects | What You Had |
|-----------|----------------|--------------|
| **Render** | Binds service to random port (e.g., 10000) | Expected `$PORT` variable |
| **Your Command** | `--bind 0.0.0.0:5001` | Hardcoded to 5001 |
| **Result** | Port mismatch | ❌ Never goes live |
| **Fix** | Use `$PORT` variable | ✅ Works with any port |

---

## ✅ After Service Goes Live

You'll get a URL like:
```
https://ai-learn-ml-service.onrender.com
```

Then:
1. Copy this URL
2. Go to **Backend service** in Render
3. Environment → `ML_SERVICE_URL` → Paste the URL
4. Save (backend will redeploy)

---

**This fix should get your ML service live in 2-3 minutes!** 🚀
