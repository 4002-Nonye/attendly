const mongoose = require('mongoose');

const Course = mongoose.model('Course');
const User = mongoose.model('User');

exports.getCourses = async (req, res) => {
  try {
    const { role, schoolID, id: userID } = req.user;
    let courses;

    const user = await User.findById(userID);
  

    if (role === 'admin') {
      // Admin should see all courses in their school
      courses = await Course.find({ schoolID })
        .populate('lecturers', 'fullName email')
        .populate('faculty', 'name')
        .populate('department', 'name');
    } else if (role === 'lecturer') {
      // Lecturer should see courses in their faculty and department
      courses = await Course.find({
        schoolID,
        faculty: user.faculty,
        department: user.department,
      })
        .populate('faculty')
        .populate('department');
    } else if (role === 'student') {
      // Student should see courses in their faculty, department and level
      courses = await Course.find({
        schoolID,
        faculty: user.faculty,
        department: user.department,
        level: user.level,
      })
        .populate('faculty')
        .populate('department');
    }

    return res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCourseByID = async (req, res) => {
  try {
    const { schoolID } = req.user;
    const { id: courseID } = req.params;

    // Fetch the course only if it belongs to the user's school
    const course = await Course.findOne({ _id: courseID, schoolID })
      .populate('faculty', 'name')       
      .populate('department', 'name')   
      .populate('lecturers', 'fullName email'); 

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    return res.status(200).json({ course });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
