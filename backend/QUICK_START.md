# 🎯 Quick Start - Your Learning Journey

Welcome to your backend development journey! This guide will take you from zero to deployed in clear, achievable steps.

---

## 📍 Where You Are Now

✅ Frontend built (React + TypeScript)  
✅ Backend code created (Node.js + Express)  
🔲 Backend not running yet  
🔲 No database connected  
🔲 Not deployed  

**Goal:** Get everything running locally, then deploy to production.

---

## 🗺️ Your Journey Map

```
Day 1: Local Setup (2-3 hours)
  ├─ Install Node.js
  ├─ Install dependencies
  ├─ Set up MongoDB Atlas (free database)
  └─ Run backend locally ✅

Day 2: Connect Services (1-2 hours)
  ├─ Set up Cloudinary (images)
  ├─ Set up Stripe (payments)
  └─ Test API endpoints ✅

Day 3: Deploy (1-2 hours)
  ├─ Deploy backend to Render.com
  ├─ Deploy frontend to Netlify
  └─ Connect them together ✅

Day 4: Final Testing
  ├─ Test user registration/login
  ├─ Test creating ads
  ├─ Test subscriptions
  └─ Launch! 🚀
```

---

## 🚀 Step 1: Local Setup (START HERE)

### A. Install Node.js (if not installed)

1. Go to https://nodejs.org/
2. Download **LTS version** (v18 or v20)
3. Install with default settings
4. Verify:
   ```bash
   node --version   # Should show v18.x.x or v20.x.x
   npm --version    # Should show 9.x.x or higher
   ```

### B. Install Backend Dependencies

Open PowerShell in your backend folder:

```powershell
cd "C:\Users\callz\OneDrive\Documents\My Projects\Websites\adboard\backend"
npm install
```

This will take 2-3 minutes. You'll see lots of packages being installed.

### C. Create Your Environment File

```powershell
Copy-Item .env.example .env
```

Now open `.env` in VS Code and we'll fill it in the next steps.

---

## 🗄️ Step 2: Set Up MongoDB Atlas (15 minutes)

### Why MongoDB Atlas?
- ☁️ Cloud database (no local installation)
- 🆓 512MB free forever
- 🌍 Accessible from anywhere

### Setup:

1. **Create Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with Google (easiest)

2. **Create Free Cluster**
   - Choose **M0 Sandbox** (FREE)
   - Provider: AWS
   - Region: Choose closest to you
   - Name: `adboard-cluster`
   - Click **Create**
   - ⏱️ Wait 3-5 minutes

3. **Create Database User**
   - Go to **Security** → **Database Access**
   - Click **Add New Database User**
   - Username: `adboard_admin`
   - Password: Click **Autogenerate** → **COPY THIS PASSWORD!**
   - Save password in a notepad
   - Database User Privileges: **Atlas admin**
   - Click **Add User**

4. **Allow Network Access**
   - Go to **Security** → **Network Access**
   - Click **Add IP Address**
   - Click **Allow Access From Anywhere**
   - Click **Confirm**

5. **Get Connection String**
   - Go to **Database** tab
   - Click **Connect** button
   - Choose **Connect your application**
   - Copy the connection string
   - Replace `<password>` with your saved password
   - Replace `myFirstDatabase` with `adboard`
   
   Final string looks like:
   ```
   mongodb+srv://adboard_admin:YourPassword123@adboard-cluster.abc12.mongodb.net/adboard?retryWrites=true&w=majority
   ```

6. **Add to .env**
   ```
   MONGODB_URI=mongodb+srv://adboard_admin:YourPassword123@adboard-cluster.abc12.mongodb.net/adboard?retryWrites=true&w=majority
   ```

---

## 🔑 Step 3: Generate JWT Secret (2 minutes)

This is for secure user authentication.

Run in PowerShell:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (long random string) and add to `.env`:
```
JWT_SECRET=your_generated_string_here
```

---

## ✅ Step 4: Test Your Backend (5 minutes)

### A. Seed the Database

```powershell
npm run seed
```

Expected output:
```
✅ Connected to MongoDB
🗑️  Cleared existing subscription plans
✅ Created 3 subscription plans
✅ Created admin user
   Email: admin@adboard.com
   Password: Admin123!
🎉 Database seeded successfully!
```

If you see errors, check your MongoDB connection string.

### B. Start the Server

```powershell
npm run dev
```

Expected output:
```
🚀 ========================================
🚀 AdBoard API Server Running
🚀 Environment: development
🚀 Port: 5000
🚀 URL: http://localhost:5000
🚀 ========================================
✅ MongoDB Connected: adboard-cluster.abc12.mongodb.net
📊 Database: adboard
```

### C. Test in Browser

Open: http://localhost:5000/health

You should see:
```json
{
  "status": "OK",
  "message": "AdBoard API is running",
  "environment": "development"
}
```

**🎉 CONGRATULATIONS! Your backend is running!**

---

## 📸 Step 5: Set Up Cloudinary (10 minutes)

Cloudinary stores uploaded images (free 25GB).

1. **Create Account**
   - Go to: https://cloudinary.com/users/register/free
   - Sign up with Google

2. **Get Credentials**
   - Go to Dashboard: https://cloudinary.com/console
   - Copy these values:
     - Cloud Name
     - API Key
     - API Secret (click eye icon to reveal)

3. **Add to .env**
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

## 💳 Step 6: Set Up Stripe (15 minutes)

Stripe handles payments.

1. **Create Account**
   - Go to: https://dashboard.stripe.com/register
   - Sign up

2. **Get Test Keys**
   - Dashboard: https://dashboard.stripe.com/test/apikeys
   - Copy **Publishable key** (pk_test_...)
   - Copy **Secret key** (sk_test_..., click reveal)

3. **Add to .env**
   ```
   STRIPE_SECRET_KEY=sk_test_your_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

4. **Add to Frontend .env** (in main project folder)
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

---

## 🔗 Step 7: Connect Frontend to Backend

### A. Update Frontend Environment

In main project folder, create/edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### B. Disable Mock Mode

In each service file (`src/services/*.service.ts`), change:

**auth.service.ts:**
```typescript
const USE_MOCK_AUTH = false; // was true
```

**ad.service.ts:**
```typescript
const USE_MOCK_DATA = false; // was true
```

**subscription.service.ts:**
```typescript
const USE_MOCK_DATA = false; // was true
```

### C. Test Full Stack

1. **Start Backend:**
   ```powershell
   cd backend
   npm run dev
   ```

2. **Start Frontend** (new terminal):
   ```powershell
   npm run dev
   ```

3. **Test Registration:**
   - Go to http://localhost:5173
   - Click Login
   - Register a new user
   - Should work without errors!

4. **Test Creating Ad:**
   - Login
   - Click "Post Ad"
   - Fill form
   - Submit
   - Should appear in your ads list!

---

## 🎯 What You've Accomplished

✅ Backend running locally  
✅ MongoDB cloud database connected  
✅ Cloudinary for images ready  
✅ Stripe for payments configured  
✅ Frontend talking to backend  
✅ Full authentication working  
✅ Ads can be created/viewed  

---

## 📝 Your Current .env Should Look Like:

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adboard?...

JWT_SECRET=your_64_character_hex_string_here
JWT_EXPIRES_IN=30d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

FRONTEND_URL=http://localhost:5173

ADMIN_EMAIL=admin@adboard.com
ADMIN_PASSWORD=Admin123!@#
```

---

## 🚀 Next Steps (When Ready)

1. **Read SETUP_GUIDE.md** for deployment instructions
2. **Deploy backend** to Render.com (free)
3. **Deploy frontend** to Netlify (free)
4. **Test production** with real domain

---

## 🆘 Troubleshooting

**Backend won't start:**
- Check MongoDB connection string
- Verify Node.js is installed: `node --version`
- Check port 5000 isn't in use: `npx kill-port 5000`

**Frontend can't connect:**
- Verify backend is running on port 5000
- Check `.env` has correct `VITE_API_URL`
- Look for CORS errors in browser console

**Database errors:**
- Verify MongoDB IP whitelist includes 0.0.0.0/0
- Check username/password in connection string
- Ensure database name is `adboard`

---

## 🎓 What You're Learning

1. **Backend Development** - Express.js, Node.js
2. **Database Management** - MongoDB, Mongoose
3. **Authentication** - JWT, bcrypt
4. **Cloud Services** - MongoDB Atlas, Cloudinary, Stripe
5. **API Design** - RESTful principles
6. **Security** - Password hashing, token auth, rate limiting
7. **Deployment** - Cloud hosting, environment variables

---

## 💡 Remember

- Take breaks! This is a lot to learn
- Google errors - you're not the first to encounter them
- Join the MongoDB/Node.js communities
- Ask questions on Stack Overflow
- Save your passwords and keys somewhere safe!

---

## 🎉 You're Doing Great!

Building a full-stack application from scratch is challenging. Every error you fix makes you a better developer. Keep going! 🚀

**Current Progress: 60% Complete**
- ✅ Frontend built
- ✅ Backend built
- ✅ Local development working
- 🔲 Deployed to production (next step!)

---

Need help? Check the full [SETUP_GUIDE.md](./SETUP_GUIDE.md) or Google specific errors!
