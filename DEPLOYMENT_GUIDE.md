# 🚀 LOreAi Deployment Guide

## 📋 **Deployment Overview**

- **Frontend**: Deploy to Vercel (React app)
- **Backend**: Deploy to Railway or Render (FastAPI app)

---

## 🎯 **Step 1: Deploy Backend First**

### **Option A: Railway (Recommended)**

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Create New Project** → "Deploy from GitHub repo"
4. **Select your repository**
5. **Configure Environment Variables**:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   DATABASE_URL=sqlite:///./loreai.db
   FRONTEND_URL=https://your-frontend-url.vercel.app
   API_PORT=8000
   ```
6. **Railway will auto-detect** Python and install dependencies
7. **Deploy!** Your backend will be live at `https://your-project.railway.app`

### **Option B: Render**

1. **Go to [Render.com](https://render.com)**
2. **Create New** → "Web Service"
3. **Connect GitHub repo**
4. **Configure**:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app/main.py`
   - **Environment**: Python 3.9
5. **Add Environment Variables** (same as Railway)
6. **Deploy!**

---

## 🎯 **Step 2: Deploy Frontend to Vercel**

### **Method 1: Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd workingspace/frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: loreai-frontend
# - Directory: ./
# - Override settings? N
```

### **Method 2: Vercel Dashboard**

1. **Go to [vercel.com](https://vercel.com)**
2. **Import Project** from GitHub
3. **Select your repository**
4. **Configure**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `workingspace/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. **Add Environment Variables**:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-url.railway.app/api/chat
   REACT_APP_BACKEND_HEALTH_URL=https://your-backend-url.railway.app/health
   ```
6. **Deploy!**

---

## 🔧 **Step 3: Update Frontend Environment Variables**

After deploying your backend, update your frontend's environment variables in Vercel:

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Settings** → **Environment Variables**
4. **Add**:
   - `REACT_APP_BACKEND_URL` = `https://your-backend-url.railway.app/api/chat`
   - `REACT_APP_BACKEND_HEALTH_URL` = `https://your-backend-url.railway.app/health`

---

## 🎯 **Step 4: Test Your Deployment**

1. **Visit your Vercel URL**: `https://your-project.vercel.app`
2. **Check AI Assistant**: Should show "AI Backend Online"
3. **Test functionality**: Try asking questions in the AI Assistant
4. **Verify data**: Check if dashboard loads with real data

---

## 🛠 **Troubleshooting**

### **Backend Issues**
- **Check logs** in Railway/Render dashboard
- **Verify environment variables** are set correctly
- **Ensure Google API key** is valid
- **Check if port** is set correctly (8000)

### **Frontend Issues**
- **Check environment variables** in Vercel
- **Verify backend URL** is correct
- **Check browser console** for errors
- **Ensure CORS** is configured in backend

### **CORS Configuration**
Your backend already has CORS configured, but if you have issues, check `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🎉 **Deployment Complete!**

Your LOreAi platform will be live at:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-project.railway.app`

### **Next Steps**
1. **Test all functionality**
2. **Share your live URL**
3. **Monitor performance**
4. **Set up custom domain** (optional)

---

## 💡 **Pro Tips**

- **Railway** gives you a free tier with good performance
- **Vercel** has excellent React support and fast CDN
- **Environment variables** are crucial for connecting frontend/backend
- **Always test** the AI Assistant after deployment
- **Monitor logs** for any issues

---

*Happy deploying! 🚀*
