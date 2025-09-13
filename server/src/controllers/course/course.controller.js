const mongoose = require('mongoose');

const Course = mongoose.model('Course');
const User = mongoose.model('User');

exports.getCourses = async (req, res) => {
  try {
    
    const { role ,schoolID,id:userID} = req.user;
    let courses
  
    const user= await User.findById(userID)

    if (role === 'admin') {
      // Admin should see all courses in their school
       courses = await Course.find({schoolID})
        .populate('lecturers', 'fullName email')
        .populate('students', 'fullName email');
    }
   else if(role==='lecturer'){
    // Lecturer should see courses in their faculty and department

    }

    return res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCourseByID = async (req, res) => {};
