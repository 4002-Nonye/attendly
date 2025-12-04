const mongoose = require('mongoose');

const {
  buildStudentAttendanceAggregation,
} = require('../../../utils/attendanceAggregation');
const School = mongoose.model('School');
const Course = mongoose.model('Course');


exports.getAdminCourseAttendanceDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { schoolId } = req.user;

    // Find the school's current academic period
    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester attendanceThreshold')
      .lean();

    if (!school) return res.status(404).json({ error: 'School not found' });

    const threshold = school.attendanceThreshold || 65;

    // Get course details
    const course = await Course.findOne({
      _id: mongoose.Types.ObjectId.createFromHexString(courseId),
      schoolId: mongoose.Types.ObjectId.createFromHexString(schoolId),
    })
      .populate('department', 'name')
      .populate('faculty', 'name')
      .lean();

    if (!course) return res.status(404).json({ error: 'Course not found' });

    //Build and execute aggregation pipeline

    const pipeline = buildStudentAttendanceAggregation(
      courseId,
      schoolId,
      school,
      threshold,
      course
    );
    const result = await Course.aggregate(pipeline);
    if (!result || result.length === 0) {
      return res.json({
        courseInfo: {
          _id: course._id,
          courseCode: course.courseCode,
          courseTitle: course.courseTitle,
          level: course.level,
          department: course.department,
          faculty: course.faculty,
          totalSessions: 0,
        },
        summary: {
          totalStudents: 0,
          eligibleCount: 0,
          notEligibleCount: 0,
          threshold: threshold,
        },
        students: [],
      });
    }

    const data = result[0];


    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

