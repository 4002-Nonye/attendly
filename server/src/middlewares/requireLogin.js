const jwt = require('jsonwebtoken');

const requireLogin = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).send({
      error: 'Invalid or expired token',
    });
  }
};

module.exports = requireLogin;
