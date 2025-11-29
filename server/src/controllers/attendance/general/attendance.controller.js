const mongoose = require('mongoose');
const { generateAttendancePDF } = require('../../../lib/pdfReportGenerator');
const {
  buildStudentAttendanceAggregation,
} = require('../../../utils/attendanceAggregation');
const School = mongoose.model('School');
const Course = mongoose.model('Course');
const User = mongoose.model('User');

exports.downloadAttendanceReport = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { schoolId, role, id: userId } = req.user;

    // Find the school's current academic period
    const school = await School.findById(schoolId)
      .select(
        'currentAcademicYear currentSemester attendanceThreshold schoolName'
      )
      .populate('currentAcademicYear', 'year')
      .lean();

    if (!school) return res.status(404).json({ error: 'School not found' });

    let threshold = school.attendanceThreshold || 65;

    if (role === 'lecturer') {
      const lecturer = await User.findById(userId)
        .select('attendanceThreshold')
        .lean();
      if (lecturer?.attendanceThreshold) {
        threshold = lecturer.attendanceThreshold; // lecturer override
      }
    }

    // Build course query based on role
    let courseQuery = {
      _id: mongoose.Types.ObjectId.createFromHexString(courseId),
      schoolId: mongoose.Types.ObjectId.createFromHexString(schoolId),
    };

    // For lecturers, verify they teach this course (check if userId is in lecturers array)
    if (role === 'lecturer') {
      courseQuery.lecturers = { $in: [userId] };
    }

    // Get course details
    const course = await Course.findOne(courseQuery)
      .populate('department', 'name')
      .populate('faculty', 'name')
      .populate('lecturers', 'name email') // Populate lecturers if needed
      .lean();

    if (!course) {
      return res.status(404).json({
        error:
          role === 'lecturer'
            ? 'Course not found or you are not assigned to this course'
            : 'Course not found',
      });
    }

    // Extract the academic year ID from the populated object
    const academicYearId = school.currentAcademicYear._id;
    const academicYearValue = school.currentAcademicYear.year;

    // Build and execute aggregation pipeline
    const pipeline = buildStudentAttendanceAggregation(
      courseId,
      schoolId,
      {
        currentAcademicYear: academicYearId,
        currentSemester: school.currentSemester,
      },
      threshold,
      course
    );

    const result = await Course.aggregate(pipeline);

    // Handle empty results
    if (!result || result.length === 0) {
      const emptyData = {
        universityName: school.schoolName || 'My University',
        courseCode: course.courseCode,
        courseTitle: course.courseTitle,
        students: [],
      };

      const pdfBuffer = await generateAttendancePDF(emptyData, {
        watermark: true,
        confidential: true,
        showSealPlaceholder: true,
      });

      const emptyFilename = `attendance-${course.courseCode.replace(
        /\s+/g,
        '-'
      )}-${academicYearValue.replace('/', '-')}-${
        school.currentSemester
      }-Semester-${Date.now()}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${emptyFilename}"`
      );
      return res.send(pdfBuffer);
    }

    const data = result[0];

    // Format data for PDF generation
    const pdfData = {
      universityName: school.schoolName || 'My University',
      courseCode: data.courseInfo.courseCode,
      courseTitle: data.courseInfo.courseTitle,
      department: data.courseInfo.department?.name,
      faculty: data.courseInfo.faculty?.name,
      academicYear: academicYearValue,
      semester: school.currentSemester,
      threshold: threshold,
      totalSessions: data.courseInfo.totalSessions,
      summary: data.summary,
      students: data.students.map((student) => ({
        matricNo: student.matricNo,
        fullName: student.fullName,
        enrolledAtSession: student.enrolledAtSession,
        totalSessions: student.totalSessions,
        totalAttended: student.totalAttended,
        totalAbsent: student.totalAbsent,
        attendancePercentage: student.attendancePercentage,
        eligible: student.eligible,
      })),
    };

    // PDF generation options
    const pdfOptions = {
      watermark: true,
      confidential: true,
      showSealPlaceholder: true,
    };

    // Generate PDF
    const pdfBuffer = await generateAttendancePDF(pdfData, pdfOptions);

    // Set response headers and send
    const filename = `attendance-${data.courseInfo.courseCode.replace(
      /\s+/g,
      '-'
    )}-${academicYearValue.replace('/', '-')}-${
      school.currentSemester
    }-Semester-${Date.now()}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');

    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation failed:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};
