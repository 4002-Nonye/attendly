const mongoose = require('mongoose');

const Course = mongoose.model('Course');
const User = mongoose.model('User');
const School = mongoose.model('School');

exports.getCourses = async (req, res) => {
  try {
    const { role, schoolId, id: userId } = req.user;
    const { search, department, level } = req.query;

    // Find the user to access faculty, department, and level information
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the user's school and ensure it has an active academic year
    const school = await School.findById(schoolId);
    if (!school || !school.currentAcademicYear) {
      return res.status(400).json({ error: 'No active academic year found' });
    }

    // Base filter: all courses within this school and its current academic year
    let filter = {
      schoolId: school._id,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    };

    // search by course code or course title
    if (search) {
      filter.$or = [
        { courseCode: { $regex: search, $options: 'i' } },
        { courseTitle: { $regex: search, $options: 'i' } },
      ];
    }

    // filter by department
    if (department) {
      filter.department = department;
    }

    // filter by level
    if (level) {
      filter.level = Number(level);
    }

    // filtering based on user role
    if (role === 'lecturer' || role === 'student') {
      // Lecturers and students can only see courses in their faculty & department
      filter.faculty = user.faculty;

      // filter by user's department
      filter.department = user.department;

      // students additionally see only courses that match their level
      if (role === 'student') {
        filter.level = user.level;
      }
    }

    // fetch courses that match the filter
    const courses = await Course.find(filter)
      // populate relational fields for clearer response data
      .populate('lecturers', 'fullName email') // Lecturer info
      .populate('faculty', 'name') // Faculty name
      .populate('department', 'name maxLevel') // Department name
      // sort by last created
      .sort({ createdAt: -1 })
      .lean();

    // add status for lecturer
    if (role === 'lecturer') {
      const formattedCourses = courses.map((course) => ({
        ...course,
        status: course.lecturers.some(
          (l) => l._id.toString() === userId.toString()
        ),
      }));
      return res.status(200).json({ courses: formattedCourses });
    }

    return res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getCourseById = async (req, res) => {
  try {
    const { schoolId } = req.user;
    const { id: courseId } = req.params;

    // Find the user's school and ensure it has an active academic year
    const school = await School.findById(schoolId);
    if (!school || !school.currentAcademicYear) {
      return res.status(400).json({ error: 'No active academic year found' });
    }

    // Fetch the course only if it belongs to the user's school
    const course = await Course.findOne({
      _id: courseId,
      schoolId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    })
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
