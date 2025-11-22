# Blog API Implementation Summary

## What Was Implemented

✅ **New API endpoint**: `POST https://www.listynest.com/api/blogs`

### Key Features:

1. **Dual Authentication Support**
   - API Key authentication (for n8n and external tools)
   - Admin JWT authentication (for admin dashboard - existing)

2. **API Key Authentication Methods**
   - `X-API-Key` header (recommended)
   - `Authorization: Bearer` token

3. **Flexible Request Format**
   - Required fields: `title`, `content`
   - Optional fields: `slug`, `excerpt`, `status`, `category`, `tags`, `publishDate`
   - Auto-generation of slug and excerpt if not provided

4. **Proper Error Handling**
   - 400: Missing required fields
   - 400: Duplicate slug
   - 401: Invalid/missing API key
   - 500: Server errors

5. **Standard Response Format**
   - Success: 201 Created with blog details and permalink
   - Error: Proper error messages with details

## Files Created/Modified

### Created:
1. ✅ `backend/middleware/apiKey.middleware.js` - API key validation middleware
2. ✅ `backend/BLOG_API.md` - Complete API documentation

### Modified:
1. ✅ `backend/routes/blog.routes.js` - Updated POST endpoint to support dual authentication
2. ✅ `backend/.env` - Added BLOG_API_KEY and BLOG_API_AUTHOR_ID variables

## Setup Instructions

### 1. Generate API Key
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Update Environment Variables
Edit `backend/.env`:
```env
BLOG_API_KEY=sk-your-generated-api-key-here
BLOG_API_AUTHOR_ID=your-user-mongodb-id-here
```

### 3. Get Author User ID
- Log into your MongoDB Atlas or local MongoDB
- Find a user in the `users` collection
- Copy the `_id` field (e.g., `64f7c0b6e9c41234abcd5678`)
- Paste it as `BLOG_API_AUTHOR_ID` in your `.env`

### 4. Restart Backend Server
```bash
cd backend
npm start
```

## Testing the API

### Test with cURL:
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sk-your-generated-api-key-here" \
  -d '{
    "title": "Test Blog Post from API",
    "content": "<p>This is a test post created via the new API endpoint.</p>",
    "status": "draft",
    "category": "Tips"
  }'
```

### Expected Response:
```json
{
  "message": "Blog post created successfully",
  "id": "673a1b2c3d4e5f6a7b8c9d0e",
  "permalink": "https://www.listynest.com/blog/test-blog-post-from-api-1234567890",
  "blog": {
    "id": "673a1b2c3d4e5f6a7b8c9d0e",
    "title": "Test Blog Post from API",
    "slug": "test-blog-post-from-api-1234567890",
    "status": "draft",
    "category": "Tips",
    "publishDate": "2025-11-17T10:30:00.000Z",
    "createdAt": "2025-11-17T10:30:00.000Z"
  }
}
```

## n8n Integration

### HTTP Request Node Setup:
- **Method**: POST
- **URL**: `https://www.listynest.com/api/blogs`
- **Authentication**: Header Auth
  - Header Name: `X-API-Key`
  - Header Value: `{{your-api-key}}`
- **Body**: JSON
  ```json
  {
    "title": "{{ $json.title }}",
    "content": "{{ $json.content }}",
    "status": "published",
    "category": "Automation"
  }
  ```

## Security Notes

⚠️ **Important**:
- Keep `BLOG_API_KEY` secret
- Don't commit it to Git
- Use HTTPS in production
- Rotate keys periodically
- Monitor API usage in logs

## Next Steps

1. ✅ Generate your API key
2. ✅ Add environment variables to `.env`
3. ✅ Add the same variables to your Render.com dashboard (for production)
4. ✅ Test locally with cURL
5. ✅ Set up your n8n workflow
6. ✅ Test end-to-end

## Documentation

Full API documentation is available in:
📄 `backend/BLOG_API.md`
