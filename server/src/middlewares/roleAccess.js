// managing access to endpoints
const requireStudentAccess = (req, res, next) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ error: 'Students only' });
  next();
};

const requireLecturerAccess = (req, res, next) => {
  if (req.user.role !== 'lecturer')
    return res.status(403).json({ error: 'Lecturers only' });
  next();
};

const requireAdminAccess = (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ error: 'Admins only' });
  next();
};

//  for multiple roles
const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied',
      });
    }

    next();
  };
};

module.exports = {
  requireStudentAccess,
  requireLecturerAccess,
  requireAdminAccess,
  requireRoles
};
