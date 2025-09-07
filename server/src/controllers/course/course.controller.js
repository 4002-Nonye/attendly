const mongoose = require('mongoose');

const Course = mongoose.model('Course');

exports.createCourse = async (req, res) => {
  try {
    const {
      courseCode,
      courseTitle,
      semester,
      department,
      faculty,
      session,
      level,
    } = req.body;
    // prettier-ignore
    if ( !courseCode || !courseTitle || !semester || !department || !faculty || !session|| !level) {
      return res.status(400).json({
        error: 'All fields are required',
      });

    }

    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      return res.status(409).json({ error: 'Course already exists' });
    }

    const newCourse = await new Course({
      courseCode,
      courseTitle,
      semester,
      department,
      faculty,
      session,
      level,
    }).save();
    return res.status(201).json({ message: 'Course created', newCourse });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCoursesForStudent = async (req, res) => {
  // logic to fetch courses relevant to the student
};

exports.getCoursesForLecturer = async (req, res) => {
  // logic to fetch courses relevant to the lecturer
};

exports.getCoursesForAdmin = async (req, res) => {
  try {
    // Optionally filter by faculty, department, level, or session using query params
    const filter = {};
    if (req.query.faculty) filter.faculty = req.query.faculty;
    if (req.query.department) filter.department = req.query.department;
    if (req.query.level) filter.level = req.query.level;
    if (req.query.session) filter.session = req.query.session;
    const courses = await Course.find(filter)
      .populate('lecturers', 'fullName email')
      .populate('students', 'fullName email');

    return res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCourseByID = async (req, res) => {};
exports.editCourse = async (req, res) => {};
exports.deleteCourse = async (req, res) => {};


exports.assignLecturer = async (req, res) => {
  try {
    const { courseIDs } = req.body;
    const lecturerID = req.user.id;
    console.log(req.user)

    // Validate IDs
    if (!courseIDs || !Array.isArray(courseIDs) || courseIDs.length === 0) {
      return res.status(400).json({ message: 'No courses selected' });
    }

    // Filter out invalid MongoDB ObjectIds
    const validIds = courseIDs.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (validIds.length !== courseIDs.length) {
      return res.status(400).json({ message: 'Some course IDs are invalid' });
    }

    // Prepare bulk operations
    // For each valid course ID, create an update operation
    const bulkOps = validIds.map((courseID) => ({
      updateOne: {
        // $ne ensures we only update courses where lecturer is NOT already assigned
        filter: {
          _id: courseID,
          lecturers: { $ne: lecturerID },
        },
        update: { $addToSet: { lecturers: lecturerID } },
        // $addToSet ensures we don't add duplicate IDs in the array
      },
    }));

    //Execute bulk update
    const result = await Course.bulkWrite(bulkOps);

    // fetch updated data for response
    const updatedCourses = await Course.find({ _id: { $in: validIds } }).populate('lecturers', 'fullName email');
    res.status(200).json({message:'Course(s) assigned successfully',updatedCourses})

   
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
exports.registerCourse = async (req, res) => {};
