# Blog API Documentation

## Create Blog Post via API

This endpoint allows external systems (like n8n workflows) to create blog posts programmatically.

### Endpoint

```
POST https://www.listynest.com/api/blogs
```

### Authentication

The API supports two authentication methods:

#### Option 1: X-API-Key Header (Recommended)
```
X-API-Key: your-secret-api-key-here
```

#### Option 2: Bearer Token
```
Authorization: Bearer your-secret-api-key-here
```

### Environment Variables Required

Add these to your `.env` file:

```env
# API key for blog post creation
BLOG_API_KEY=sk-your-super-secret-api-key-here

# User ID that will be set as the author for API-created posts
BLOG_API_AUTHOR_ID=your-mongodb-user-id-here

# Frontend URL for permalink generation
FRONTEND_URL=https://www.listynest.com
```

**To generate a secure API key:**
```bash
# In Node.js or terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**To get the author user ID:**
```bash
# In MongoDB or via your admin panel
# Find a user and copy their _id field
```

### Request Format

**Headers:**
```
Content-Type: application/json
X-API-Key: sk-your-super-secret-api-key-here
```

**Body (JSON):**
```json
{
  "title": "Your Blog Post Title Goes Here",
  "slug": "your-blog-post-title-goes-here",
  "content": "<p>This is the HTML content of your blog post.</p><p>It can include paragraphs, <strong>bold text</strong>, etc.</p>",
  "excerpt": "A short summary of the blog post (optional, will be auto-generated if not provided)",
  "status": "published",
  "category": "Automation",
  "tags": ["n8n", "automation", "blogging"]
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ Yes | The main title of the blog post |
| `content` | string | ✅ Yes | The full HTML content of the blog post |
| `slug` | string | ❌ No | URL-friendly identifier (auto-generated from title if not provided) |
| `excerpt` | string | ❌ No | Short summary (auto-generated from content if not provided, max 300 chars) |
| `status` | string | ❌ No | `published`, `draft`, or `scheduled` (default: `draft`) |
| `category` | string | ❌ No | `Tips`, `News`, `Guide`, `Update`, or `Announcement` (default: `Tips`) |
| `publishDate` | ISO date | ❌ No | Publication date (defaults to current date if status is `published`) |
| `tags` | array | ❌ No | Array of tag strings (for future use) |

### Success Response

**Status Code:** `201 Created`

```json
{
  "message": "Blog post created successfully",
  "id": "673a1b2c3d4e5f6a7b8c9d0e",
  "permalink": "https://www.listynest.com/blog/your-blog-post-title-goes-here-1234567890",
  "blog": {
    "id": "673a1b2c3d4e5f6a7b8c9d0e",
    "title": "Your Blog Post Title Goes Here",
    "slug": "your-blog-post-title-goes-here-1234567890",
    "status": "published",
    "category": "Automation",
    "publishDate": "2025-11-17T10:30:00.000Z",
    "createdAt": "2025-11-17T10:30:00.000Z"
  }
}
```

### Error Responses

#### 400 Bad Request - Missing Required Field
```json
{
  "error": "Title is required",
  "details": "The 'title' field was not provided in the request body."
}
```

#### 400 Bad Request - Duplicate Slug
```json
{
  "error": "Slug already exists",
  "details": "A blog post with the slug 'existing-slug' already exists. Please use a different slug."
}
```

#### 401 Unauthorized - Invalid API Key
```json
{
  "error": "Unauthorized",
  "details": "Invalid or missing API key. Please provide a valid X-API-Key header or Authorization Bearer token."
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "An error occurred while creating the blog post"
}
```

## Example Usage

### cURL Example

```bash
curl -X POST https://www.listynest.com/api/blogs \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sk-your-super-secret-api-key-here" \
  -d '{
    "title": "How to Automate Your Blog with n8n",
    "content": "<p>In this guide, we will show you how to automate blog posting using n8n workflows.</p><p>First, set up your API credentials...</p>",
    "status": "published",
    "category": "Guide",
    "tags": ["automation", "n8n", "blogging"]
  }'
```

### JavaScript/Node.js Example

```javascript
const response = await fetch('https://www.listynest.com/api/blogs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'sk-your-super-secret-api-key-here'
  },
  body: JSON.stringify({
    title: 'How to Automate Your Blog with n8n',
    content: '<p>In this guide, we will show you how to automate blog posting using n8n workflows.</p>',
    status: 'published',
    category: 'Guide',
    tags: ['automation', 'n8n', 'blogging']
  })
});

const data = await response.json();
console.log(data);
```

### n8n Workflow Example

1. **HTTP Request Node Configuration:**
   - Method: `POST`
   - URL: `https://www.listynest.com/api/blogs`
   - Authentication: `Header Auth`
     - Name: `X-API-Key`
     - Value: `sk-your-super-secret-api-key-here`
   - Body Content Type: `JSON`
   - Body:
     ```json
     {
       "title": "{{ $json.title }}",
       "content": "{{ $json.content }}",
       "status": "published",
       "category": "Automation"
     }
     ```

2. **Response Handling:**
   - Success (201): Blog post created, use `{{ $json.permalink }}` to get the URL
   - Error (4xx/5xx): Check `{{ $json.error }}` and `{{ $json.details }}` for error info

## Security Notes

1. **Keep your API key secret** - Never commit it to version control
2. **Use HTTPS only** - API keys should only be sent over secure connections
3. **Rotate keys periodically** - Generate new keys and update your integrations
4. **Monitor API usage** - Check logs for unauthorized access attempts
5. **Use draft status** - Set `status: "draft"` for automated posts you want to review before publishing

## Admin Panel Access

The same endpoint also works with your existing admin authentication:
- Admin users can create blog posts using their JWT token
- Use the standard `Authorization: Bearer <jwt-token>` header
- Works with your existing admin dashboard

## Testing

Test the API endpoint locally:

```bash
# Start your backend server
cd backend
npm start

# Test with curl (replace with your actual API key and author ID)
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-test-api-key" \
  -d '{
    "title": "Test Blog Post",
    "content": "<p>This is a test post created via API.</p>",
    "status": "draft"
  }'
```
