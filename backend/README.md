# AdBoard Backend API

Complete Node.js/Express backend for the AdBoard classified ads platform.

## 🚀 Features

- ✅ **User Authentication** - JWT-based auth with bcrypt password hashing
- ✅ **Ad Management** - Full CRUD operations for classified ads
- ✅ **Subscription Plans** - Tiered pricing (Free, Basic, Pro)
- ✅ **Payment Processing** - Stripe integration for subscriptions
- ✅ **Admin Panel** - User management, ad moderation, analytics
- ✅ **Cloud Database** - MongoDB Atlas integration
- ✅ **Image Upload** - Cloudinary integration ready
- ✅ **Security** - Helmet, CORS, rate limiting, input validation
- ✅ **RESTful API** - Clean, documented endpoints

## 📁 Project Structure

```
backend/
├── models/              # Mongoose schemas
│   ├── User.model.js
│   ├── Ad.model.js
│   ├── SubscriptionPlan.model.js
│   └── PaymentTransaction.model.js
├── routes/              # Express route handlers
│   ├── auth.routes.js
│   ├── ad.routes.js
│   ├── user.routes.js
│   ├── subscription.routes.js
│   ├── payment.routes.js
│   └── admin.routes.js
├── middleware/          # Custom middleware
│   └── auth.middleware.js
├── utils/               # Helper functions
│   └── jwt.util.js
├── scripts/             # Database utilities
│   └── seedDatabase.js
├── server.js            # Main application file
├── package.json
└── .env.example
```

## 🛠️ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials (see SETUP_GUIDE.md).

### 3. Seed Database

```bash
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs on: `http://localhost:5000`

## 📚 API Documentation

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/update-profile` | Update profile | Private |
| PUT | `/api/auth/change-password` | Change password | Private |

### Ads

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/ads` | Get all ads (with filters) | Public |
| GET | `/api/ads/:id` | Get single ad | Public |
| POST | `/api/ads` | Create new ad | Private |
| PUT | `/api/ads/:id` | Update ad | Private (owner) |
| DELETE | `/api/ads/:id` | Delete ad | Private (owner) |
| POST | `/api/ads/:id/favorite` | Toggle favorite | Private |
| POST | `/api/ads/:id/report` | Report ad | Private |

### Subscriptions

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/subscriptions` | Get active plans | Public |
| GET | `/api/subscriptions/:id` | Get plan details | Public |

### Payments

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/payments/create-checkout-session` | Start Stripe checkout | Private |
| POST | `/api/payments/webhook` | Stripe webhook handler | Stripe |

### Admin

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/stats` | Dashboard statistics | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| PUT | `/api/admin/users/:id/suspend` | Suspend user | Admin |
| PUT | `/api/admin/users/:id/ban` | Ban user | Admin |
| GET | `/api/admin/ads` | Get all ads | Admin |
| PUT | `/api/admin/ads/:id/archive` | Archive ad | Admin |
| GET | `/api/admin/subscriptions` | Get all plans | Admin |
| POST | `/api/admin/subscriptions` | Create plan | Admin |
| PUT | `/api/admin/subscriptions/:id` | Update plan | Admin |
| DELETE | `/api/admin/subscriptions/:id` | Delete plan | Admin |

## 🔐 Authentication

All private routes require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🗄️ Database Models

### User
- Authentication & profile
- Subscription details
- Favorites
- Admin privileges

### Ad
- Title, description, price
- Category & location
- Images
- Status (active, sold, expired)
- Reports & flags

### SubscriptionPlan
- Pricing tiers
- Feature limits
- Stripe integration
- Admin management

### PaymentTransaction
- Payment history
- Stripe references
- Transaction status

## 🚀 Deployment

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for complete deployment instructions including:
- MongoDB Atlas setup
- Cloudinary configuration
- Stripe integration
- Render.com deployment

## 🔧 Environment Variables

Required variables:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
```

## 📝 Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with initial data
```

## 🛡️ Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention (MongoDB)
- ✅ XSS protection

## 🧪 Testing

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get subscription plans
curl http://localhost:5000/api/subscriptions
```

## 📖 Learn More

- [Complete Setup Guide](./SETUP_GUIDE.md)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Stripe API Docs](https://stripe.com/docs/api)
- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)

## 🤝 Support

Need help? Check the [SETUP_GUIDE.md](./SETUP_GUIDE.md) troubleshooting section.

## 📄 License

MIT
