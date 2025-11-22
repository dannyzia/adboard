/**
 * API Key Authentication Middleware
 * Validates X-API-Key header or Bearer token for external API access
 */

/**
 * Validates API key from X-API-Key header or Authorization Bearer token
 * Checks against BLOG_API_KEY environment variable
 */
function validateApiKey(req, res, next) {
  // Check X-API-Key header first
  const apiKey = req.headers['x-api-key'];
  
  // If no X-API-Key, check Authorization header
  let bearerToken = null;
  if (!apiKey) {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');
    if (scheme === 'Bearer' && token) {
      bearerToken = token;
    }
  }

  const validKey = process.env.BLOG_API_KEY;
  
  if (!validKey) {
    console.error('BLOG_API_KEY environment variable is not configured');
    return res.status(500).json({
      error: 'Server configuration error',
      details: 'API key authentication is not properly configured'
    });
  }

  const providedKey = apiKey || bearerToken;

  if (!providedKey || providedKey !== validKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      details: 'Invalid or missing API key. Please provide a valid X-API-Key header or Authorization Bearer token.'
    });
  }

  return next();
}

module.exports = { validateApiKey };
