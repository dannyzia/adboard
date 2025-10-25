const jwt = require('jsonwebtoken');

// Generate JWT Token
exports.generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    }
  );
};

// Verify JWT Token
exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
