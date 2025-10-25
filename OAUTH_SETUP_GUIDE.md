# OAuth Setup Guide for AdBoard

## Current Status
✅ **Frontend OAuth UI is complete**
⚠️ **Backend OAuth is using MOCK authentication for development**

## Mock OAuth (Currently Active)
The app is using mock OAuth for development:
- Clicking "Google" creates a user: `user@google.com`
- Clicking "GitHub" creates a user: `user@github.com`
- This allows you to test the UI without a backend

## Setting Up Real OAuth

### Option 1: Google OAuth Setup

#### Step 1: Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to: APIs & Services → Credentials
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen if needed
6. Application type: Web application
7. Add authorized redirect URI:
   ```
   http://localhost:5000/auth/google/callback
   https://yourdomain.com/auth/google/callback
   ```
8. Copy the **Client ID** and **Client Secret**

#### Step 2: Backend Implementation (Node.js/Express)
```bash
npm install passport passport-google-oauth20 express-session
```

```javascript
// backend/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    // Find or create user in database
    const user = await User.findOrCreate({
      email: profile.emails[0].value,
      name: profile.displayName,
      googleId: profile.id,
      avatar: profile.photos[0].value
    });
    return done(null, user);
  }
));

// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET);
    
    // Redirect to frontend with token
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);
```

#### Step 3: Environment Variables
```env
# .env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

#### Step 4: Update Frontend
In `LoginPage.tsx`, uncomment the production code:
```typescript
const handleSocialLogin = (provider: 'google' | 'github') => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  window.location.href = `${apiUrl}/auth/${provider}`;
};
```

---

### Option 2: GitHub OAuth Setup

#### Step 1: Create GitHub OAuth App
1. Go to [GitHub Settings → Developer settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in details:
   - Application name: AdBoard
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:5000/auth/github/callback`
4. Copy the **Client ID** and generate **Client Secret**

#### Step 2: Backend Implementation
```bash
npm install passport passport-github2
```

```javascript
// backend/config/passport.js
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    const user = await User.findOrCreate({
      email: profile.emails[0].value,
      name: profile.displayName || profile.username,
      githubId: profile.id,
      avatar: profile.photos[0].value
    });
    return done(null, user);
  }
));

// Routes
app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET);
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);
```

---

### Frontend Token Handling

Add this to handle OAuth callback:
```typescript
// In LoginPage.tsx useEffect
useEffect(() => {
  // Check for OAuth token in URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    // Save token to localStorage
    localStorage.setItem('token', token);
    
    // Fetch user info
    api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      // Update auth context
      setUser(response.data.user);
      navigate('/');
    });
  }
}, []);
```

---

## Testing OAuth

### Test Google OAuth
1. Start backend server: `node server.js`
2. Start frontend: `npm run dev`
3. Click "Continue with Google"
4. Should redirect to Google login
5. After authorization, redirect back with user logged in

### Test GitHub OAuth
Same process but with GitHub

---

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Store secrets in environment variables
- [ ] Validate OAuth state parameter (CSRF protection)
- [ ] Implement proper session management
- [ ] Set secure cookie flags
- [ ] Rate limit OAuth endpoints
- [ ] Handle OAuth errors gracefully
- [ ] Log OAuth attempts for security monitoring

---

## Troubleshooting

### "Redirect URI mismatch"
- Check OAuth console callback URLs match exactly
- Include protocol (http/https)
- Include port number for localhost

### "Access denied"
- Check OAuth app approval status
- Verify scopes requested match app permissions
- Check if user cancelled authorization

### "Invalid client"
- Verify Client ID and Secret are correct
- Check environment variables are loaded
- Ensure OAuth app is not suspended

---

## Production Considerations

1. **Use HTTPS**: Required for OAuth in production
2. **Update Redirect URIs**: Change to production domain
3. **Secure Secrets**: Use environment variables, never commit
4. **Session Management**: Implement proper session storage (Redis)
5. **Error Handling**: Graceful fallbacks for OAuth failures
6. **User Merging**: Handle users who sign up with email then OAuth

---

## Alternative: Firebase Authentication

For faster setup, consider Firebase Auth:

```bash
npm install firebase
```

```javascript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  // Use Firebase token with your backend
};
```

Firebase handles OAuth complexity and provides:
- Multiple providers (Google, GitHub, Facebook, Twitter)
- Token management
- User authentication state
- No backend OAuth code needed

---

## Need Help?

- [Passport.js Documentation](http://www.passportjs.org/)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Docs](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)

---

**Current Mock Setup**: The app creates test users automatically for development. This is sufficient for frontend testing but requires backend implementation for production use.
