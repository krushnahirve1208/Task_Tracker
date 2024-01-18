const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protected = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request for further processing in route handlers
    req.userId = decoded.userId;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // If verification fails or any other error occurs
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = protected;
