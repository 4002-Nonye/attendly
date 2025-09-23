module.exports = (role, body, res) => {
  const {
    fullName,
    email,
    password,
    matricNo,
    faculty,
    department,
    schoolInput,
    level,
  } = body;

  // Common required fields for everyone
  if (!fullName || !email || !password || !role || !schoolInput) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (role === 'student') {
    // Students need matricNo, faculty, department, level
    if (!matricNo || !faculty || !department || !level) {
      return res.status(400).json({
        error: 'Matric number, faculty, department, and level are required for students',
      });
    }
  }

  if (role === 'lecturer') {
    // Lecturers need faculty and department 
    if (!faculty || !department) {
      return res.status(400).json({
        error: 'Faculty and department are required for lecturers',
      });
    }
  }

  
  return null; // no error
};
