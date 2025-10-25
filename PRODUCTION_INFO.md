# 🚀 AdBoard Production Information
## Quick Reference Guide

---

## 📍 Live URLs

- **Frontend (Vercel)**: https://adboard-red.vercel.app
- **Backend (Render)**: https://adboard-backend.onrender.com
- **API Base URL**: https://adboard-backend.onrender.com/api
- **Health Check**: https://adboard-backend.onrender.com/health

---

## 🔑 Credentials & Access

### **Admin Account**
- **Email**: `admin@adboard.com`
- **Password**: `admin1122`
- **Admin Panel**: https://adboard-red.vercel.app/admin/login

### **GitHub Repository**
- **Repo**: https://github.com/dannyzia/adboard
- **Branch**: `main`

---

## 🌐 Dashboard Links

### **Hosting & Deployment**
- **Vercel Dashboard**: https://vercel.com/dashboard
  - Project: `adboard`
  - Deployments: https://vercel.com/dannyzia/adboard
  
- **Render Dashboard**: https://dashboard.render.com
  - Service: `adboard-backend`
  - Logs: Check here if backend issues occur

### **Database & Storage**
- **MongoDB Atlas**: https://cloud.mongodb.com
  - Cluster: `adboard`
  - Database: `adboard`
  - Connection String: `mongodb+srv://adboard_user:7CCn5rmCwEaCoq42@adboard.ree5cck.mongodb.net/adboard`

- **Cloudinary Dashboard**: https://console.cloudinary.com
  - Cloud Name: `dwr0inyhr`
  - Media Library: https://console.cloudinary.com/console/media_library

### **OAuth & APIs**
- **Google Cloud Console**: https://console.cloud.google.com/apis/credentials
  - OAuth Client: For Google login configuration

---

## ⚙️ Environment Variables

### **Vercel (Frontend)**
```
VITE_API_URL=https://adboard-backend.onrender.com/api
```

### **Render (Backend)**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://adboard_user:7CCn5rmCwEaCoq42@adboard.ree5cck.mongodb.net/adboard?retryWrites=true&w=majority&appName=adboard
JWT_SECRET=[Your Generated Secret]
JWT_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=dwr0inyhr
CLOUDINARY_API_KEY=465664689833235
CLOUDINARY_API_SECRET=9Y6nwnwaz5vqaQg_4KTMd2Ri_B0
FRONTEND_URL=https://adboard-red.vercel.app
GOOGLE_CLIENT_ID=1024003866663-lk36rc1htbn6mdscsfg6j2ea99fm07n5.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=https://adboard-backend.onrender.com/api/auth/google/callback
ADMIN_EMAIL=admin@adboard.com
ADMIN_PASSWORD=admin1122
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🔧 Google OAuth Configuration

### **Authorized JavaScript Origins**
```
http://localhost:5173
http://localhost:5000
https://adboard-red.vercel.app
https://adboard-backend.onrender.com
```

### **Authorized Redirect URIs**
```
http://localhost:5000/api/auth/google/callback
https://adboard-backend.onrender.com/api/auth/google/callback
https://adboard-red.vercel.app/auth/callback
```

---

## 📊 Service Status & Monitoring

### **Keep-Alive Service (Recommended)**
- **UptimeRobot**: https://uptimerobot.com
  - Monitor URL: `https://adboard-backend.onrender.com/health`
  - Interval: Every 5 minutes
  - Purpose: Prevents Render free tier cold starts

### **Alternative Keep-Alive**
- **Cron-Job.org**: https://cron-job.org
  - Same URL, every 10 minutes

---

## 🛠️ Development Commands

### **Local Development**
```bash
# Frontend
cd "C:\Users\callz\OneDrive\Documents\My Projects\Websites\adboard"
npm run dev

# Backend
cd backend
npm start
```

### **Build & Deploy**
```bash
# Build frontend locally
npm run build

# Deploy to Vercel (automatic on git push to main)
git add .
git commit -m "Your message"
git push origin main

# Render deploys automatically on push
```

---

## 📱 Features Available

### **User Features**
- ✅ Google OAuth Login
- ✅ Email/Password Authentication
- ✅ Post Ads (with image upload via Cloudinary)
- ✅ Browse Ads (infinite scroll)
- ✅ Filter by Category, Country, State, City
- ✅ Search Ads
- ✅ View Ad Details
- ✅ User Dashboard
- ✅ Edit/Delete Own Ads
- ✅ Subscription Plans (Free, Basic, Pro)

### **Admin Features**
- ✅ Admin Login
- ✅ Dashboard with Analytics
- ✅ Manage All Ads
- ✅ Manage Users
- ✅ Manage Subscriptions
- ✅ View Reports
- ✅ Archive Management
- ✅ System Settings

---

## 🚨 Troubleshooting Quick Reference

### **Site Not Loading**
1. Check Vercel deployment status
2. Check `VITE_API_URL` in Vercel environment variables
3. Open browser console for errors

### **API Errors / Backend Down**
1. Check Render service status (might be cold start - wait 30 seconds)
2. View Render logs for errors
3. Verify MongoDB Atlas is accessible (IP whitelist: 0.0.0.0/0)
4. Set up UptimeRobot to prevent cold starts

### **Google Login Not Working**
1. Verify OAuth URLs in Google Cloud Console
2. Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Render
3. Verify `GOOGLE_CALLBACK_URL` matches in both Google Console and Render
4. Check `FRONTEND_URL` in Render

### **Images Not Uploading**
1. Check Cloudinary credentials in Render
2. Verify Cloudinary upload preset is unsigned
3. Check browser console for upload errors
4. Check Cloudinary dashboard for recent uploads

### **Database Connection Issues**
1. Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
2. Check connection string in Render
3. Verify database user credentials
4. Check MongoDB Atlas cluster status

---

## 💰 Service Costs

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | **FREE** (100GB bandwidth/month) |
| Render | Free | **FREE** (with cold starts) |
| MongoDB Atlas | M0 Free | **FREE** (512MB storage) |
| Cloudinary | Free | **FREE** (25GB storage, 25GB bandwidth) |
| UptimeRobot | Free | **FREE** (50 monitors) |
| **Total** | | **$0/month** 🎉 |

### **Optional Upgrades**
- Render Starter: $7/month (no cold starts, always-on)
- Vercel Pro: $20/month (more bandwidth, analytics)
- MongoDB M10: $0.08/hour (~$57/month for production)

---

## 🔐 Security Notes

### **Secrets to Keep Private**
- ❌ Never commit `.env` files
- ❌ Don't share JWT_SECRET
- ❌ Keep database credentials private
- ❌ Protect Cloudinary API secret
- ❌ Keep Google OAuth client secret private

### **Public Information**
- ✅ Frontend URL is public
- ✅ Backend API URL is public
- ✅ Cloudinary cloud name is public
- ✅ Google Client ID is public (in frontend)

---

## 📈 Next Steps

### **Immediate**
- [ ] Set up UptimeRobot for keep-alive
- [ ] Seed some sample ads for testing
- [ ] Test all features thoroughly

### **Short Term**
- [ ] Add custom domain to Vercel
- [ ] Set up error monitoring (Sentry)
- [ ] Add Google Analytics
- [ ] Configure email service (SendGrid/Mailgun)

### **Long Term**
- [ ] Implement payment processing (Stripe)
- [ ] Add email notifications
- [ ] Implement admin password change feature
- [ ] Add user profile pages
- [ ] SEO optimization (meta tags, sitemap)
- [ ] PWA features

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://www.mongodb.com/docs/atlas
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev

---

## 📝 Important Files in This Project

- `DEPLOYMENT_GUIDE.md` - Step-by-step deployment instructions
- `OAUTH_SETUP_GUIDE.md` - Google OAuth setup details
- `CLOUDINARY_SETUP.md` - Cloudinary configuration
- `README.md` - Project overview and setup
- `backend/README.md` - Backend API documentation
- `adboard_instructions/COPILOT_INSTRUCTIONS.md` - Development guidelines

---

**Last Updated**: October 25, 2025  
**Status**: ✅ Production Ready & Deployed

---

## 🎉 Quick Actions

**View Live Site**: https://adboard-red.vercel.app  
**Admin Panel**: https://adboard-red.vercel.app/admin/login  
**API Health**: https://adboard-backend.onrender.com/health  
**View Logs**: https://dashboard.render.com → adboard-backend → Logs  
**Redeploy Frontend**: Vercel Dashboard → Deployments → Redeploy  
**Redeploy Backend**: Git push or Render Dashboard → Manual Deploy
