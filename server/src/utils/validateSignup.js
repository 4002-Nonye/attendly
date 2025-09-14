
module.exports = (role, body, res) => {
  const {
    fullName,
    email,
    password,
    matricNo,
    faculty,
    department,
    schoolName,
    level
  } = body;

  if (!fullName || !email || !password || !role || !schoolName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (role === 'student' && (!matricNo || !faculty || !department || !level)) {
    return res
      .status(400)
      .json({ error: 'Matric number, faculty, department and level are required for students' });
  }

  if (role !== 'student' && (matricNo || faculty || department || level)) {
    return res
      .status(400)
      .json({ error: 'Matric number, faculty, department and level should only be provided for students' });
  }

  return null; // no error
};
