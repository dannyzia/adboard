# Cloudinary Image Upload Setup Guide

## ✅ What's Been Implemented:

### Backend:
- ✅ Cloudinary configuration (`config/cloudinary.config.js`)
- ✅ Multer integration for file handling
- ✅ Upload routes (`routes/upload.routes.js`):
  - `POST /api/upload/single` - Upload single image
  - `POST /api/upload/multiple` - Upload up to 5 images
  - `DELETE /api/upload/:publicId` - Delete image
- ✅ Image validation (type, size, format)
- ✅ Automatic image optimization (resize, quality, format)

### Frontend:
- ✅ Updated `upload.service.ts` with Cloudinary endpoints
- ✅ `ImageUploadZone` component with drag & drop
- ✅ `PostAdPage` integrated with real file uploads
- ✅ Upload progress tracking
- ✅ Image preview before upload

---

## 🔧 Setup Instructions:

### 1. Create Cloudinary Account (FREE)

1. Go to: https://cloudinary.com/users/register_free
2. Sign up with your email
3. Verify your email
4. You'll be redirected to the dashboard

### 2. Get Your Credentials

Once logged in to Cloudinary:

1. You'll see your **Dashboard** with credentials displayed
2. Copy these three values:
   - **Cloud Name**: (e.g., `dxxxxxxxx`)
   - **API Key**: (e.g., `123456789012345`)
   - **API Secret**: (e.g., `abcdefghijklmnopqrstuvwxyz123`)

### 3. Update Backend .env File

Open `backend/.env` and replace the placeholder values:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret
```

**Example (with fake credentials):**
```env
CLOUDINARY_CLOUD_NAME=dqx7fhk2j
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123
```

### 4. Restart Backend Server

After updating .env:

```powershell
cd backend
npm run dev
```

The server will reload with Cloudinary configuration.

---

## 🧪 Testing the Upload Feature:

### Test 1: Single Image Upload via API

```powershell
# Create a test image file first, then:
curl -X POST http://localhost:5000/api/upload/single `
  -H "Authorization: Bearer YOUR_JWT_TOKEN" `
  -F "image=@path/to/test-image.jpg"
```

### Test 2: Frontend Upload (Recommended)

1. **Login** to your account
2. Go to **"Post Ad"** page
3. You'll see the new **drag & drop upload zone**
4. Either:
   - Click to select files
   - Drag & drop images
5. Images will upload to Cloudinary automatically
6. You'll see upload progress bar
7. Preview uploaded images before posting

---

## 📸 Features:

### Drag & Drop Upload:
- Drop files directly into the upload zone
- Visual feedback when dragging
- Multi-file support (up to 5 images)

### Image Validation:
- ✅ Only image files accepted (JPG, PNG, GIF, WebP)
- ✅ Max 5MB per image
- ✅ Max 5 images per ad
- ✅ Real-time error messages

### Automatic Optimization:
- Images resized to max 1200x1200px
- Auto quality compression
- Format conversion (WebP when supported)
- CDN delivery for fast loading

### Image Management:
- Preview before upload
- Remove images before posting
- Upload progress tracking
- Existing images preserved when editing

---

## 🔒 Security Features:

- ✅ Authentication required (JWT token)
- ✅ File type validation
- ✅ File size limits
- ✅ Cloudinary folder isolation (`adboard/`)
- ✅ Public ID encoding for safe deletion

---

## 📂 File Storage Structure:

Images are stored in Cloudinary with this structure:

```
adboard/
  ├── abc123xyz.jpg  (auto-generated IDs)
  ├── def456uvw.png
  └── ghi789rst.webp
```

Each image gets:
- Unique public ID
- CDN URL for fast delivery
- Automatic backups (Cloudinary handles this)

---

## 💰 Cloudinary Free Tier Limits:

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Admin API calls**: 5,000/month

**Perfect for development and small/medium scale production!**

---

## 🐛 Troubleshooting:

### Error: "Cloudinary credentials not found"
- Make sure you updated `.env` with real credentials
- Restart the backend server after changing `.env`

### Error: "Invalid file type"
- Only JPG, PNG, GIF, WebP allowed
- Check file extension and MIME type

### Error: "File too large"
- Max 5MB per image
- Compress images before uploading

### Error: "Max images exceeded"
- Limit is 5 images per ad
- Remove some images before uploading more

### Upload slow?
- Check your internet speed
- Large images (near 5MB) take longer
- Progress bar shows upload status

---

## 🚀 Next Steps:

After Cloudinary is working:

1. ✅ Test uploading images in Post Ad page
2. ✅ Verify images display in ad cards
3. ✅ Test editing ads (preserves existing images)
4. 🔲 Add image reordering (drag to reorder)
5. 🔲 Add image cropping tool
6. 🔲 Add thumbnail generation

---

## 📝 Code Files Modified:

**Backend:**
- `config/cloudinary.config.js` - NEW
- `routes/upload.routes.js` - NEW
- `server.js` - Added upload routes

**Frontend:**
- `services/upload.service.ts` - Updated with Cloudinary endpoints
- `pages/PostAdPage.tsx` - Integrated real uploads
- `components/forms/ImageUploadZone.tsx` - Already had drag & drop

**Dependencies:**
- `cloudinary` - Already installed ✅
- `multer` - Already installed ✅
- `multer-storage-cloudinary` - Newly installed ✅

---

## ✨ Result:

Users can now:
- Drag & drop images to upload
- Upload from their device (no more URL inputs!)
- See upload progress
- Preview images before posting
- Fast image delivery via Cloudinary CDN
- Automatic image optimization

**Ready to test! Just add your Cloudinary credentials to `.env` and restart the backend.** 🎉
