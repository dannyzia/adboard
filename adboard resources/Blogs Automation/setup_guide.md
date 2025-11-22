# Blog Automation System - 100% FREE VERSION

## 🎉 Completely Free - No Credit Card Required!

This system uses only FREE APIs with generous rate limits. Zero monthly costs!

## Free API Options

### AI Content Generation (Choose ONE)

#### Option 1: Groq (RECOMMENDED - Best Free Option)
- **Rate Limit**: 30 requests/minute, 14,400/day
- **Sign up**: https://console.groq.com/
- **Cost**: 100% FREE
- **Models**: Llama 3.1 70B (very fast & high quality)
- **No credit card needed**

#### Option 2: Together AI
- **Free Credits**: $25 on signup
- **Sign up**: https://api.together.xyz/
- **Models**: Mixtral 8x7B, Llama models
- **Lasts**: ~1,600 blog posts

#### Option 3: Hugging Face
- **Rate Limit**: Free tier available
- **Sign up**: https://huggingface.co/
- **Models**: Mixtral, Llama, and more
- **100% FREE**

### Image APIs (All FREE)

#### Pixabay (RECOMMENDED)
- **Rate Limit**: 5,000 requests/hour
- **Sign up**: https://pixabay.com/api/docs/
- **Cost**: 100% FREE
- **Quality**: High-quality stock photos

#### Pexels
- **Rate Limit**: 200 requests/hour
- **Sign up**: https://www.pexels.com/api/
- **Cost**: 100% FREE

#### Unsplash
- **Rate Limit**: 50 requests/hour
- **Sign up**: https://unsplash.com/developers
- **Cost**: 100% FREE

## Installation Steps

### 1. Install Dependencies

```bash
npm install express prisma @prisma/client node-cron axios dotenv cors
npm install -D typescript @types/express @types/node @types/cors ts-node
```

### 2. Get Your FREE API Keys

#### Get Groq API Key (5 minutes):
1. Go to https://console.groq.com/
2. Sign up with email (no credit card)
3. Go to API Keys section
4. Create new key
5. Copy your key

#### Get Pixabay API Key (2 minutes):
1. Go to https://pixabay.com/api/docs/
2. Sign up
3. Your API key is shown immediately
4. Copy your key

#### Get Pexels API Key (backup):
1. Go to https://www.pexels.com/api/
2. Sign up
3. Get API key from dashboard

#### Get Unsplash Access Key (backup):
1. Go to https://unsplash.com/developers
2. Create account
3. Create new application
4. Copy Access Key

### 3. Environment Variables

Create `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/blog_db"
# Or use FREE PostgreSQL from Supabase/Railway/Render

# AI API - Use ONE of these (Groq recommended)
GROQ_API_KEY="your_groq_api_key_here"
# TOGETHER_API_KEY="your_together_key" # Alternative
# HUGGINGFACE_API_KEY="your_hf_key" # Alternative

# Image APIs (get all 3 for best reliability)
PIXABAY_API_KEY="your_pixabay_key"
PEXELS_API_KEY="your_pexels_key"
UNSPLASH_ACCESS_KEY="your_unsplash_key"

# Server
PORT=3000
NODE_ENV=development
```

### 4. Free Database Options

Choose one FREE database:

#### Option 1: Supabase (PostgreSQL)
- **Free tier**: 500MB database
- **Sign up**: https://supabase.com/
- Get connection string from dashboard

#### Option 2: Railway (PostgreSQL)
- **Free tier**: $5 monthly credits
- **Sign up**: https://railway.app/

#### Option 3: MongoDB Atlas
- **Free tier**: 512MB
- **Sign up**: https://www.mongodb.com/cloud/atlas

#### Option 4: Local SQLite (Simplest)
```env
DATABASE_URL="file:./dev.db"
```

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### 5. Database Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Project Structure

```
your-project/
├── src/
│   ├── services/
│   │   └── blog-automation-service.ts
│   ├── routes/
│   │   └── blog-automation.routes.ts
│   └── server.ts
├── prisma/
│   └── schema.prisma
├── .env
├── package.json
└── tsconfig.json
```

### 7. Create server.ts

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import blogRoutes from './routes/blog-automation.routes';
import { blogAutomation } from './services/blog-automation-service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', blogRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Free blog automation active!`);
});
```

### 8. Run the Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Usage

### Load Topics

```bash
curl -X POST http://localhost:3000/api/automation/topics/load \
  -H "Content-Type: application/json" \
  -d '{
    "topics": [
      "The Future of AI in Healthcare",
      "Sustainable Living Tips",
      "Remote Work Best Practices",
      "Web Development Trends 2025"
    ]
  }'
```

### Generate Blog Now (Testing)

```bash
curl -X POST http://localhost:3000/api/automation/generate-now
```

### Check Status

```bash
curl http://localhost:3000/api/automation/status
```

### Get Blogs

```bash
curl http://localhost:3000/api/blogs?published=true
```

## Rate Limits & Capacity

With **FREE** APIs:

### Daily Capacity:
- **Groq**: 14,400 blog posts/day
- **Pixabay**: 120,000 images/day
- **Your automation**: 2 blogs/day

You have **7,200x** more capacity than needed! 🎉

### Monthly Capacity:
- **60 blogs/month** (2 per day)
- **Cost**: $0.00
- **Rate limit issues**: Virtually impossible

## Free Hosting Options

Deploy your backend for FREE:

### 1. Render (Recommended)
- **Free tier**: Web service + PostgreSQL
- **Sign up**: https://render.com/
- Zero config deployment
- Auto-deploy from GitHub

### 2. Railway
- **Free tier**: $5/month credits
- **Sign up**: https://railway.app/
- One-click deploy

### 3. Fly.io
- **Free tier**: 3 VMs
- **Sign up**: https://fly.io/

### 4. Vercel (for Node.js)
- **Free tier**: Serverless functions
- **Sign up**: https://vercel.com/

## Cost Breakdown

| Service | Cost | Limit |
|---------|------|-------|
| Groq API | $0 | 14,400/day |
| Pixabay | $0 | 5,000/hour |
| Pexels | $0 | 200/hour |
| Unsplash | $0 | 50/hour |
| Database (Supabase) | $0 | 500MB |
| Hosting (Render) | $0 | 750 hours/month |
| **TOTAL** | **$0/month** | ✅ |

## Automated Schedule

Blogs auto-generate at:
- **9:00 AM** - Blog 1
- **3:00 PM** - Blog 2

Every single day, automatically!

## Troubleshooting

### "API rate limit exceeded"
- With Groq's limits, this shouldn't happen
- If it does, system auto-falls back to Together AI or Hugging Face

### "No image found"
- System tries 3 APIs automatically
- Images are optional - blog will still publish

### "Database connection failed"
- Check your DATABASE_URL
- Ensure your free database service is active

## Production Tips

### Use PM2 (Free)
```bash
npm install -g pm2
pm2 start dist/server.js --name blog-automation
pm2 startup
pm2 save
```

### Monitor for FREE
- Use Render's built-in logs
- Or use free tier of Sentry.io for error tracking

## Scaling Up (Still Free)

If you need more than 2 blogs/day:

1. **Groq can handle**: 7,200 blogs/day for FREE
2. **Adjust schedule**: Change `POSTING_TIMES` array
3. **Add more times**: `['06:00', '09:00', '12:00', '15:00', '18:00', '21:00']`

All still 100% FREE!

## Example: React Integration

```typescript
// BlogList.tsx
import { useEffect, useState } from 'react';

export function BlogList() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('https://your-free-backend.render.com/api/blogs?published=true')
      .then(res => res.json())
      .then(data => setBlogs(data.blogs));
  }, []);

  return (
    <div>
      {blogs.map(blog => (
        <article key={blog.id}>
          {blog.imageUrl && <img src={blog.imageUrl} alt={blog.heading} />}
          <h2>{blog.heading}</h2>
          <p>{blog.shortDescription}</p>
          <div>{blog.content}</div>
        </article>
      ))}
    </div>
  );
}
```

## Summary

✅ **100% FREE**
✅ **No credit card required**
✅ **Unlimited blogs** (within generous free limits)
✅ **High-quality AI content**
✅ **Royalty-free images**
✅ **Automatic scheduling**
✅ **Zero maintenance costs**

Get 60 professional blogs per month for **$0.00**! 🎉