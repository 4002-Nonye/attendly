const requireAdminAccess = (req, res, next) => {
 
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Admin access required.' });
};

module.exports = requireAdminAccess;
