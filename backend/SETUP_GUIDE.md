# 🚀 AdBoard Backend Setup Guide

Complete step-by-step guide to get your backend running locally and deploy to production.

---

## 📋 Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Cloudinary Setup](#cloudinary-setup)
4. [Stripe Setup](#stripe-setup)
5. [Testing the Backend](#testing-the-backend)
6. [Deploy to Render.com](#deploy-to-rendercom)
7. [Connect Frontend](#connect-frontend)

---

## 🏠 Local Development Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Create Environment File

Copy the example file:
```bash
cp .env.example .env
```

Edit `.env` and add your values (we'll get these in next steps).

### Step 3: Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET` in `.env`.

---

## 🗄️ MongoDB Atlas Setup

MongoDB Atlas is a free cloud database (512MB free tier).

### Step 1: Create Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google or email
3. Choose **FREE** M0 tier
4. Select a cloud provider (AWS recommended)
5. Choose region closest to you
6. Name your cluster (e.g., "adboard-cluster")
7. Click **Create Cluster** (takes 3-5 minutes)

### Step 2: Create Database User

1. Click **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Username: `adboard_admin` (or your choice)
5. Password: Click **Autogenerate Secure Password** (SAVE THIS!)
6. User Privileges: **Read and write to any database**
7. Click **Add User**

### Step 3: Whitelist IP Address

1. Click **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development)
   - Production: Add your server's specific IP
4. Click **Confirm**

### Step 4: Get Connection String

1. Click **Database** (left sidebar)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Driver: **Node.js**, Version: **4.1 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://adboard_admin:<password>@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with the password you saved
7. Add database name before the `?`:
   ```
   mongodb+srv://adboard_admin:YOUR_PASSWORD@cluster.xxxxx.mongodb.net/adboard?retryWrites=true&w=majority
   ```
8. Paste this in your `.env` as `MONGODB_URI`

---

## 📷 Cloudinary Setup

Cloudinary provides free image hosting (25GB/month free).

### Step 1: Create Account

1. Go to https://cloudinary.com/users/register/free
2. Sign up with Google or email
3. Verify your email

### Step 2: Get API Credentials

1. Go to Dashboard: https://cloudinary.com/console
2. You'll see your credentials:
   - **Cloud Name**: copy this
   - **API Key**: copy this
   - **API Secret**: click the eye icon to reveal, then copy

3. Add to `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

---

## 💳 Stripe Setup

Stripe handles payments (pay per transaction, no monthly fees).

### Step 1: Create Account

1. Go to https://dashboard.stripe.com/register
2. Sign up with email
3. Complete business verification (can use test mode without this)

### Step 2: Get Test API Keys

1. Go to Dashboard: https://dashboard.stripe.com/test/dashboard
2. Click **Developers** → **API Keys**
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - click to reveal

4. Add to backend `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
   ```

5. Add publishable key to frontend `.env`:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
   ```

### Step 3: Create Products in Stripe

1. Go to **Products** → **Add Product**
2. Create two products:

   **Basic Plan:**
   - Name: `AdBoard Basic`
   - Description: `For regular sellers`
   - Pricing: Recurring, $9.99/month
   - Copy the **Price ID** (starts with `price_`)

   **Pro Plan:**
   - Name: `AdBoard Pro`
   - Description: `For power users`
   - Pricing: Recurring, $29.99/month
   - Copy the **Price ID**

3. Update your subscription plans in database with these Price IDs.

### Step 4: Setup Webhook (for production)

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://your-backend-url.com/api/payments/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
   ```

---

## 🧪 Testing the Backend

### Step 1: Seed the Database

This creates subscription plans and admin user:

```bash
npm run seed
```

You should see:
```
✅ Created 3 subscription plans
✅ Created admin user
   Email: admin@adboard.com
   Password: Admin123!
🎉 Database seeded successfully!
```

### Step 2: Start the Server

```bash
npm run dev
```

You should see:
```
🚀 ========================================
🚀 AdBoard API Server Running
🚀 Environment: development
🚀 Port: 5000
🚀 URL: http://localhost:5000
🚀 ========================================
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
📊 Database: adboard
```

### Step 3: Test API Endpoints

Open a browser or use Postman:

**Health Check:**
```
http://localhost:5000/health
```
Should return: `{"status":"OK","message":"AdBoard API is running"}`

**Get Subscription Plans:**
```
http://localhost:5000/api/subscriptions
```
Should return 3 plans (Free, Basic, Pro)

**Register a User:**
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

---

## 🌐 Deploy to Render.com

Render.com offers free hosting for backend APIs.

### Step 1: Push Code to GitHub

```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Create Render Account

1. Go to https://render.com/
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Create Web Service

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `adboard-backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 4: Add Environment Variables

Click **Environment** and add all variables from your `.env`:

- `NODE_ENV` = `production`
- `MONGODB_URI` = (your Atlas connection string)
- `JWT_SECRET` = (your generated secret)
- `CLOUDINARY_CLOUD_NAME` = (your cloud name)
- `CLOUDINARY_API_KEY` = (your API key)
- `CLOUDINARY_API_SECRET` = (your API secret)
- `STRIPE_SECRET_KEY` = (your secret key)
- `STRIPE_WEBHOOK_SECRET` = (your webhook secret)
- `FRONTEND_URL` = `https://your-netlify-app.netlify.app`

### Step 5: Deploy

1. Click **Create Web Service**
2. Wait 5-10 minutes for build
3. Your API will be live at: `https://adboard-backend.onrender.com`

### Step 6: Update Frontend

In your frontend `.env`:
```
VITE_API_URL=https://adboard-backend.onrender.com/api
```

---

## 🔗 Connect Frontend

### Step 1: Update Service Files

In `src/services/*.service.ts`, change:

```typescript
const USE_MOCK_DATA = false; // Change from true to false
const USE_MOCK_AUTH = false; // Change from true to false
```

### Step 2: Update API Base URL

In `src/services/api.ts`, verify:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Step 3: Test Connection

1. Start frontend: `npm run dev`
2. Try logging in
3. Try creating an ad
4. Check browser console for any errors

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas cluster created and connected
- [ ] Cloudinary account set up with credentials
- [ ] Stripe test mode configured
- [ ] All environment variables in `.env`
- [ ] Database seeded successfully
- [ ] Local server running on port 5000
- [ ] Health check endpoint working
- [ ] Can register and login users
- [ ] Can create ads
- [ ] Backend deployed to Render.com
- [ ] Frontend connects to backend
- [ ] Stripe checkout works

---

## 🆘 Troubleshooting

### "MongoDB connection error"
- Check your connection string is correct
- Verify password doesn't have special characters (URL encode if needed)
- Confirm IP whitelist includes your IP

### "Port 5000 already in use"
- Change PORT in `.env` to 5001
- Kill existing process: `npx kill-port 5000`

### "JWT must be provided"
- Make sure you're sending token in headers: `Authorization: Bearer YOUR_TOKEN`

### "Stripe error"
- Verify you're using test keys (start with `sk_test_`)
- Check keys are in both backend and frontend

---

## 📚 Next Steps

1. **Set up file uploads** (implement Cloudinary integration)
2. **Configure email service** (SendGrid or AWS SES)
3. **Add monitoring** (Sentry for error tracking)
4. **Set up logging** (Winston or Morgan)
5. **Add rate limiting** (already configured, test it)
6. **Switch to production Stripe keys** (when ready to go live)

---

## 🎉 You're Ready!

Your backend is now fully functional! You have:
- ✅ User authentication with JWT
- ✅ Ad CRUD operations
- ✅ Subscription management
- ✅ Payment processing with Stripe
- ✅ Admin panel APIs
- ✅ Cloud database
- ✅ Free hosting

Time to build amazing features! 🚀
