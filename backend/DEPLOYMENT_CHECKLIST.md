# 🚀 Deployment Checklist

Use this checklist to ensure everything is ready for production.

---

## ✅ Pre-Deployment Checklist

### Database
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] IP whitelist configured
- [ ] Connection string tested and works
- [ ] Database seeded with subscription plans
- [ ] Admin user created

### Environment Variables
- [ ] `.env` file created (never commit this!)
- [ ] All required variables filled in
- [ ] JWT_SECRET is secure (32+ characters)
- [ ] MongoDB URI is correct
- [ ] Cloudinary credentials added
- [ ] Stripe keys added (test mode)
- [ ] Frontend URL configured

### Code
- [ ] All dependencies installed (`npm install`)
- [ ] Server starts without errors (`npm run dev`)
- [ ] Health check endpoint works
- [ ] Can register a user
- [ ] Can login
- [ ] Can create an ad
- [ ] Can view ads
- [ ] Admin login works

### Security
- [ ] Passwords are hashed (bcrypt)
- [ ] JWT tokens working
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Helmet middleware active
- [ ] Input validation on all routes
- [ ] No sensitive data in git

---

## 🌐 Production Deployment

### Backend (Render.com)

#### Step 1: Prepare Repository
- [ ] Code pushed to GitHub
- [ ] `.env` is in `.gitignore`
- [ ] `README.md` exists
- [ ] `package.json` has start script

#### Step 2: Create Render Service
- [ ] Signed up at render.com
- [ ] Connected GitHub repository
- [ ] Created new Web Service
- [ ] Set build command: `npm install`
- [ ] Set start command: `npm start`
- [ ] Selected Free plan

#### Step 3: Environment Variables
Add these in Render dashboard:
- [ ] `NODE_ENV=production`
- [ ] `PORT` (leave blank, Render sets this)
- [ ] `MONGODB_URI`
- [ ] `JWT_SECRET`
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `FRONTEND_URL` (your Netlify URL)

#### Step 4: Deploy & Test
- [ ] Service deployed successfully
- [ ] Health check works: `https://your-app.onrender.com/health`
- [ ] API endpoints accessible
- [ ] Can register/login from Postman
- [ ] Check logs for errors

### Frontend (Netlify)

#### Step 1: Build Frontend
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] `dist` folder created

#### Step 2: Deploy to Netlify
- [ ] Signed up at netlify.com
- [ ] Connected GitHub or drag-and-drop `dist` folder
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `dist`

#### Step 3: Environment Variables
Add in Netlify dashboard:
- [ ] `VITE_API_URL=https://your-backend.onrender.com/api`
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`

#### Step 4: Test
- [ ] Site is live
- [ ] Can register/login
- [ ] Can create ads
- [ ] Can view ads
- [ ] Images upload works
- [ ] Payments work (test mode)

---

## 🔒 Security Checklist

### Before Going Live
- [ ] Change all default passwords
- [ ] Use production Stripe keys
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Configure CSP headers
- [ ] Enable MongoDB IP whitelist (specific IPs)
- [ ] Review CORS settings
- [ ] Enable logging
- [ ] Set up error monitoring (Sentry)
- [ ] Back up database
- [ ] Test rate limiting

---

## 🧪 Testing Checklist

### User Flow
- [ ] User can register
- [ ] User can login
- [ ] User can update profile
- [ ] User can change password
- [ ] User can post ad
- [ ] User can edit their ad
- [ ] User can delete their ad
- [ ] User can favorite ads
- [ ] User can view favorites
- [ ] User can report ads

### Subscription Flow
- [ ] User can view pricing plans
- [ ] User can click subscribe
- [ ] Stripe checkout opens
- [ ] Can complete test payment
- [ ] Subscription updates in database
- [ ] User gets increased limits
- [ ] Can post more ads
- [ ] Subscription renews correctly

### Admin Flow
- [ ] Admin can login
- [ ] Admin sees dashboard stats
- [ ] Admin can view all users
- [ ] Admin can suspend users
- [ ] Admin can ban users
- [ ] Admin can view all ads
- [ ] Admin can archive ads
- [ ] Admin can create subscription plans
- [ ] Admin can edit plans
- [ ] Admin can delete plans

---

## 📊 Performance Checklist

- [ ] Database indexes created
- [ ] API response times < 500ms
- [ ] Images optimized
- [ ] Compression enabled
- [ ] CDN configured (Cloudinary)
- [ ] Caching headers set
- [ ] Database connection pooling
- [ ] No N+1 query problems

---

## 📝 Documentation Checklist

- [ ] README.md complete
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Setup guide exists
- [ ] Deployment guide exists
- [ ] Code comments added
- [ ] Postman collection created (optional)

---

## 🎯 Launch Day Checklist

### T-Minus 24 Hours
- [ ] Announce maintenance window
- [ ] Backup database
- [ ] Test backup restore
- [ ] Prepare rollback plan

### T-Minus 1 Hour
- [ ] Switch to production Stripe keys
- [ ] Update MongoDB IP whitelist
- [ ] Enable production logging
- [ ] Verify all environment variables

### Launch Time
- [ ] Deploy backend
- [ ] Wait for deployment
- [ ] Test health endpoint
- [ ] Deploy frontend
- [ ] Test full user flow
- [ ] Monitor error logs
- [ ] Monitor performance
- [ ] Announce launch!

### T-Plus 1 Hour
- [ ] Check error rates
- [ ] Verify user signups working
- [ ] Check payment processing
- [ ] Monitor server load
- [ ] Respond to user feedback

---

## 🆘 Emergency Contacts

Keep these handy:

**Services:**
- MongoDB Atlas Support: https://support.mongodb.com/
- Render Support: https://render.com/docs
- Netlify Support: https://www.netlify.com/support/
- Stripe Support: https://support.stripe.com/

**Rollback Plan:**
1. Revert to previous git commit
2. Redeploy old version
3. Restore database backup if needed
4. Notify users

---

## 📈 Post-Launch Monitoring

### Daily (First Week)
- [ ] Check error logs
- [ ] Monitor user signups
- [ ] Check payment success rate
- [ ] Review server performance
- [ ] Check database size

### Weekly
- [ ] Review analytics
- [ ] Check costs (should be $0!)
- [ ] Update dependencies
- [ ] Review security alerts
- [ ] Backup database

---

## 🎉 Success Metrics

Your app is successful when:
- ✅ Users can register and login
- ✅ Ads are being posted
- ✅ No critical errors
- ✅ Page load < 3 seconds
- ✅ API response < 500ms
- ✅ Uptime > 99%
- ✅ Users are happy!

---

## 🚀 Future Improvements

After launch, consider:
- [ ] Add email verification
- [ ] Implement forgot password
- [ ] Add social OAuth (Google, GitHub)
- [ ] Enable real-time chat
- [ ] Add push notifications
- [ ] Improve SEO
- [ ] Add analytics dashboard
- [ ] Create mobile app
- [ ] Expand to new regions
- [ ] Add more payment methods

---

## 📞 Need Help?

**Resources:**
- MongoDB Docs: https://docs.mongodb.com/
- Express Docs: https://expressjs.com/
- Stripe Docs: https://stripe.com/docs
- Node.js Docs: https://nodejs.org/docs/

**Communities:**
- Stack Overflow: Tag questions with `node.js`, `express`, `mongodb`
- Reddit: r/node, r/webdev
- Discord: ThePrimeagen, Fireship servers

---

**Remember:** Every successful app started where you are now. Keep building! 🚀
