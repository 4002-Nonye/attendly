// managing access to endpoints
const requireStudentAccess = (req, res, next) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Students only' });
  next();
};

const requireLecturerAccess = (req, res, next) => {
  if (req.user.role !== 'lecturer') return res.status(403).json({ error: 'Lecturers only' });
  next();
};

const requireAdminAccess = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
  next();
};

module.exports = { requireStudentAccess, requireLecturerAccess, requireAdminAccess };
