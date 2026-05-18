const jwt = require('jsonwebtoken');

module.exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'JWT secret not configured' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.user_id,
      role: decoded.role
    };
    return next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
