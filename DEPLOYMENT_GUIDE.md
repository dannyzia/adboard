# 🚀 AdBoard Deployment Guide
## Vercel (Frontend) + Render (Backend)

---

## 📋 Prerequisites

- [ ] GitHub account
- [ ] Vercel account (sign up with GitHub at https://vercel.com)
- [ ] Render account (sign up at https://render.com)
- [ ] MongoDB Atlas already set up ✅
- [ ] Cloudinary already set up ✅

---

## 🔐 Part 1: Secure Your API Keys

### **IMPORTANT: Generate New Secrets**

Your current keys are exposed in this conversation. Generate new ones:

#### 1. **New JWT Secret**
Run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output - this is your new `JWT_SECRET`

#### 2. **Admin Password**
**Current password**: `admin1122`  
**Note**: Keep this password for now. Password change functionality not yet implemented. We'll add this feature post-launch.

#### 3. **Google OAuth Credentials**
**DO NOT regenerate!** You'll update your existing credentials later (Part 4) by adding production URLs alongside your current localhost URLs.

#### 4. **Cloudinary Keys**
**Keep current keys.** They're working fine and already configured.

---

## 🎯 Part 2: Deploy Backend to Render

### **Step 1: Push Code to GitHub**

```bash
# If not already a git repo:
cd "C:\Users\callz\OneDrive\Documents\My Projects\Websites\adboard"
git init
git add .
git commit -m "Initial commit - ready for deployment"

# Create a new repository on GitHub (call it 'adboard')
# Then push:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/adboard.git
git push -u origin main
```

### **Step 2: Deploy to Render**

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → Select **"Web Service"**
3. **Connect GitHub**: Authorize Render to access your repositories
4. **Select Repository**: Choose `adboard`
5. **Configure Service**:
   - **Name**: `adboard-backend`
   - **Region**: Oregon (US West) - Closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. **Add Environment Variables**: Click "Advanced" → Add these:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://adboard_user:7CCn5rmCwEaCoq42@adboard.ree5cck.mongodb.net/adboard?retryWrites=true&w=majority&appName=adboard
JWT_SECRET=(paste your NEW secret from Step 1)
JWT_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=dwr0inyhr
CLOUDINARY_API_KEY=465664689833235
CLOUDINARY_API_SECRET=9Y6nwnwaz5vqaQg_4KTMd2Ri_B0
FRONTEND_URL=(leave empty for now, we'll add after Vercel deployment)
GOOGLE_CLIENT_ID=1024003866663-lk36rc1htbn6mdscsfg6j2ea99fm07n5.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=(your-backend-url.onrender.com/api/auth/google/callback)
ADMIN_EMAIL=admin@adboard.com
ADMIN_PASSWORD=admin1122
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

7. **Click "Create Web Service"**

8. **Wait for Deployment** (3-5 minutes)

9. **Copy Your Backend URL**: Will be something like `https://adboard-backend-xxxx.onrender.com`

---

## 🎨 Part 3: Deploy Frontend to Vercel

### **Step 1: Create Environment File**

Create `.env.production` in your root directory:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

(Replace with your actual Render backend URL from Part 2, Step 9)

### **Step 2: Commit and Push**

```bash
git add .env.production vercel.json
git commit -m "Add production config"
git push
```

### **Step 3: Deploy to Vercel**

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New..."** → **"Project"**
3. **Import Git Repository**: Select your `adboard` repository
4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is - root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   
5. **Environment Variables**: Click "Environment Variables" → Add:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

6. **Click "Deploy"**

7. **Wait for Deployment** (2-3 minutes)

8. **Copy Your Frontend URL**: Will be something like `https://adboard-xxxx.vercel.app`

---

## 🔗 Part 4: Connect Frontend & Backend

### **Update Backend Environment Variables**

1. Go back to **Render Dashboard**
2. Select your `adboard-backend` service
3. Go to **Environment** tab
4. **Update these variables**:

```
FRONTEND_URL=https://your-vercel-url.vercel.app
GOOGLE_CALLBACK_URL=https://your-backend-url.onrender.com/api/auth/google/callback
```

5. **Save Changes** (this will trigger a redeploy)

### **Update Google OAuth Callback**

1. Go to **Google Cloud Console**: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID (the one you're already using)
3. **ADD these Authorized Redirect URIs** (keep your existing localhost ones):
   - `https://your-backend-url.onrender.com/api/auth/google/callback`
   - `https://your-vercel-url.vercel.app/auth/google/callback`
4. **Save**

**Note**: Keep your localhost URLs too! This way you can still develop locally.

---

## 🤖 Part 5: Set Up Keep-Alive (Prevent Cold Starts)

### **Option 1: UptimeRobot (Easiest)** ⭐

1. **Go to**: https://uptimerobot.com
2. **Sign up** (free account)
3. **Add New Monitor**:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: AdBoard Backend Keep-Alive
   - **URL**: `https://your-backend-url.onrender.com/health`
   - **Monitoring Interval**: 5 minutes
4. **Click "Create Monitor"**

✅ Done! Your backend will never sleep!

### **Option 2: Cron-Job.org (No signup)**

1. **Go to**: https://cron-job.org
2. **Create a cronjob**:
   - **Title**: AdBoard Keep-Alive
   - **URL**: `https://your-backend-url.onrender.com/health`
   - **Schedule**: `*/10 * * * *` (every 10 minutes)
3. **Enable** the job

✅ Done!

---

## ✅ Part 6: Test Your Deployment

### **Test Checklist**:

1. **Frontend Loads**: Visit your Vercel URL
2. **API Connection**: Check browser console for errors
3. **User Login**: Try logging in
4. **Google OAuth**: Test Google login
5. **Admin Login**: Try admin@adboard.com with your new password
6. **Create Ad**: Post a test ad
7. **Image Upload**: Upload images via Cloudinary
8. **Browse Ads**: Check homepage, categories, search
9. **Mobile View**: Test on mobile device

---

## 🎉 Deployment Complete!

Your AdBoard is now live:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Database**: MongoDB Atlas (already running)
- **Images**: Cloudinary (already configured)
- **Keep-Alive**: UptimeRobot pinging every 5 minutes

---

## 🚨 Troubleshooting

### **Backend not responding**
- Check Render logs: Dashboard → Your Service → Logs
- Verify environment variables are set correctly
- Check MongoDB Atlas IP whitelist (should allow all: 0.0.0.0/0)

### **Frontend can't reach backend**
- Check VITE_API_URL in Vercel environment variables
- Check CORS settings in backend (FRONTEND_URL)
- Open browser console to see exact error

### **Google OAuth not working**
- Verify callback URLs in Google Cloud Console
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Render

### **Images not uploading**
- Verify Cloudinary credentials in Render
- Check browser console for errors

---

## 💰 Costs

- **Vercel**: FREE (100GB bandwidth/month)
- **Render**: FREE (with cold starts, or $7/month for always-on)
- **UptimeRobot**: FREE (50 monitors)
- **MongoDB Atlas**: FREE (512MB storage)
- **Cloudinary**: FREE (25GB storage, 25GB bandwidth)

**Total Monthly Cost: $0** 🎊

---

## 📈 Next Steps After Launch

1. **Custom Domain**: Add your own domain in Vercel settings
2. **Analytics**: Add Google Analytics
3. **Monitoring**: Set up error tracking (Sentry)
4. **SEO**: Add meta tags, sitemap
5. **Email**: Set up email service (SendGrid, Mailgun)
6. **Stripe**: Integrate payment processing for subscriptions

---

**Ready to deploy? Start with Part 1!** 🚀
