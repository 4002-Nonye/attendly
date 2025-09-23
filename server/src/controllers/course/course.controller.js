const mongoose = require('mongoose');

const Course = mongoose.model('Course');
const User = mongoose.model('User');

exports.getCourses = async (req, res) => {
  try {
    const { role, schoolID, id: userID } = req.user;
    const user = await User.findById(userID).lean();
    let filter = { schoolID };

   // Admin sees all courses in their school
    if (role === 'lecturer') {
      filter.faculty = user.faculty;
      filter.department = user.department;
    } else if (role === 'student') {
      filter.faculty = user.faculty;
      filter.department = user.department;
      filter.level = user.level;
    }

    
    const courses = await Course.find(filter)
      .populate('lecturers', 'fullName email')
      .populate('faculty', 'name')
      .populate('department', 'name')
      .lean();

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
