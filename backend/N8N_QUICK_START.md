# n8n Quick Setup Guide for ListyNest Blog API

## 🚀 Quick Start

### Step 1: Get Your API Key
Add this to your `backend/.env` file:
```env
BLOG_API_KEY=sk-your-secret-key-here
BLOG_API_AUTHOR_ID=your-user-id-here
```

Then add the same variables to your Render.com environment variables.

---

## 📋 n8n HTTP Request Node Configuration

### Basic Settings
- **Method**: `POST`
- **URL**: `https://www.listynest.com/api/blogs`

### Authentication
- **Type**: `Header Auth`
- **Credentials**:
  - **Name**: `X-API-Key`
  - **Value**: `sk-your-secret-key-here` (use your actual key)

### Headers
```json
{
  "Content-Type": "application/json"
}
```

### Body (JSON)
```json
{
  "title": "{{ $json.title }}",
  "content": "{{ $json.content }}",
  "status": "published",
  "category": "Automation",
  "excerpt": "{{ $json.excerpt }}"
}
```

---

## 📝 Field Reference

### Required Fields
- ✅ `title` - Blog post title
- ✅ `content` - HTML content

### Optional Fields
- `slug` - URL-friendly identifier (auto-generated if not provided)
- `excerpt` - Short summary (auto-generated from content if not provided)
- `status` - `published`, `draft`, or `scheduled` (default: `draft`)
- `category` - `Tips`, `News`, `Guide`, `Update`, or `Announcement` (default: `Tips`)
- `publishDate` - ISO date string (default: current date)
- `tags` - Array of strings (for future use)

---

## 🎯 Common n8n Workflow Patterns

### Pattern 1: RSS to Blog
```
RSS Feed Read → Set → HTTP Request (Blog API)
```

**Set Node Mapping**:
```json
{
  "title": "{{ $json.title }}",
  "content": "{{ $json.content }}",
  "status": "published",
  "category": "News"
}
```

### Pattern 2: Markdown to Blog
```
HTTP Request (Get MD) → Markdown → Set → HTTP Request (Blog API)
```

**Markdown Node**: Convert MD to HTML

**Set Node Mapping**:
```json
{
  "title": "{{ $json.title }}",
  "content": "{{ $json.html }}",
  "excerpt": "{{ $json.description }}",
  "status": "draft"
}
```

### Pattern 3: Scheduled Content
```
Cron → Airtable/Notion → Set → HTTP Request (Blog API)
```

**Set Node Mapping**:
```json
{
  "title": "{{ $json.title }}",
  "content": "{{ $json.content }}",
  "status": "published",
  "category": "{{ $json.category }}",
  "publishDate": "{{ $json.scheduled_date }}"
}
```

---

## ✅ Response Handling

### Success Response (201)
```json
{
  "message": "Blog post created successfully",
  "id": "673a1b2c3d4e5f6a7b8c9d0e",
  "permalink": "https://www.listynest.com/blog/your-post-slug",
  "blog": {
    "id": "673a1b2c3d4e5f6a7b8c9d0e",
    "title": "Your Post Title",
    "slug": "your-post-slug",
    "status": "published",
    "category": "Automation",
    "publishDate": "2025-11-17T10:30:00.000Z",
    "createdAt": "2025-11-17T10:30:00.000Z"
  }
}
```

**Access in next node**:
- Blog ID: `{{ $json.id }}`
- Permalink: `{{ $json.permalink }}`
- Slug: `{{ $json.blog.slug }}`

### Error Response (400/401/500)
```json
{
  "error": "Title is required",
  "details": "The 'title' field was not provided in the request body."
}
```

---

## 🔍 Debugging Tips

### Test with cURL First
```bash
curl -X POST https://www.listynest.com/api/blogs \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sk-your-key" \
  -d '{"title":"Test","content":"<p>Test</p>","status":"draft"}'
```

### Common Issues

**401 Unauthorized**
- ✅ Check API key is correct
- ✅ Check header name is `X-API-Key` (case-sensitive)
- ✅ Verify key is set in Render.com environment variables

**400 Bad Request - Title Required**
- ✅ Make sure `title` field is in body
- ✅ Check n8n expression is evaluating correctly
- ✅ Test with hardcoded values first

**400 Bad Request - Content Required**
- ✅ Make sure `content` field is in body
- ✅ Content should be HTML (wrap plain text in `<p>` tags)

**500 Internal Server Error - Author Not Found**
- ✅ Check `BLOG_API_AUTHOR_ID` is set correctly
- ✅ Verify the user ID exists in your database

---

## 🛡️ Security Best Practices

1. **Store API key in n8n Credentials**
   - Don't hardcode in workflows
   - Use n8n's credential manager

2. **Use Draft Status First**
   - Set `"status": "draft"` initially
   - Review posts before publishing
   - Update to `published` when ready

3. **Validate Content**
   - Add validation nodes before API call
   - Check required fields exist
   - Sanitize HTML if from untrusted sources

4. **Error Handling**
   - Add error workflow path
   - Log failed posts
   - Set up notifications for errors

---

## 📊 Example Complete Workflow

```
┌─────────────┐
│  Schedule   │  (Cron: 0 9 * * 1)
└──────┬──────┘
       │
┌──────▼──────┐
│  HTTP Get   │  (Fetch from CMS)
└──────┬──────┘
       │
┌──────▼──────┐
│  Function   │  (Transform data)
└──────┬──────┘
       │
┌──────▼──────┐
│  Set Fields │
│   title     │
│   content   │
│   status    │
└──────┬──────┘
       │
┌──────▼──────┐
│  HTTP POST  │  (Blog API)
│  Headers:   │
│  X-API-Key  │
└──────┬──────┘
       │
    ┌──▼──┐
    │ IF  │ (Check status)
    └─┬─┬─┘
      │ │
   200│ │400+
      │ │
┌─────▼──▼─────┐
│   Success    │ Error Handler │
│   Log        │ Send Alert    │
└──────────────┴───────────────┘
```

---

## 🎓 Pro Tips

1. **Batch Processing**: Use Loop node for multiple posts
2. **Duplicate Check**: Store processed IDs to avoid duplicates
3. **Image Handling**: Upload images to Cloudinary first, then reference URLs
4. **SEO**: Generate slug from title for better URLs
5. **Preview**: Create draft first, review in admin panel, then publish

---

## 📚 More Information

- Full API Docs: `backend/BLOG_API.md`
- Setup Guide: `backend/BLOG_API_SETUP.md`
- Test Endpoint: `http://localhost:5000/api/blogs` (local)
- Production: `https://www.listynest.com/api/blogs`

---

**Need Help?** Check the error response `details` field for specific guidance.
