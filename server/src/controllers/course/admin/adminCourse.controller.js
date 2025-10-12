const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const School = mongoose.model('School');
const Department = mongoose.model('Department');
const Faculty = mongoose.model('Faculty');
exports.createCourse = async (req, res) => {
  try {
    const { courseCode, courseTitle, department, faculty, level, unit } =
      req.body;
    const { schoolId } = req.user;
    // prettier-ignore
    if ( !courseCode || !courseTitle  || !department || !faculty || !level || !unit) {
      return res.status(400).json({
        error: 'All fields are required',
      });

    }

    // Validate department and faculty belong to the school
    const [departmentExists, facultyExists] = await Promise.all([
      Department.findOne({ _id: department,  schoolId }),
      Faculty.findOne({ _id: faculty,  schoolId }),
    ]);

    if (!departmentExists) {
      return res.status(404).json({ error: 'Department not found in this school' });
    }

    if (!facultyExists) {
      return res.status(404).json({ error: 'Faculty not found in this school' });
    }
    // get school for academic year and semester
    const school = await School.findById(schoolId).populate(
      'currentAcademicYear'
    );
    if (!school.currentAcademicYear) {
      return res
        .status(400)
        .json({ error: 'No active academic year found for this school' });
    }

    // Check if either courseTitle or courseCode already exists in the same department + school
    const existingCourse = await Course.findOne({
      department,
      schoolId,
      $or: [{ courseTitle }, { courseCode }],
    });

    if (existingCourse) {
      // If the title matches, send a title specific error
      if (existingCourse.courseTitle === courseTitle) {
        return res
          .status(409)
          .json({ error: 'Course title already exists in this department' });
      }
      // If the code matches, send a code specific error
      if (existingCourse.courseCode === courseCode) {
        return res
          .status(409)
          .json({ error: 'Course code already exists in this department' });
      }
    }

    const newCourse = await new Course({
      courseCode,
      courseTitle,
      department,
      faculty,
      level,
      schoolId,
      unit,
      semester: school.currentSemester,
      academicYear: school.currentAcademicYear._id,
    }).save();

    return res.status(201).json({ message: 'Course created', newCourse });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const { schoolId } = req.user;
    const { id: courseId } = req.params;

    // check if any course in the department has the code or title before updating
    const existingCourse = await Course.findOne({
      _id: { $ne: courseId }, // exclude the current course
      department: req.body.department,
      schoolId,
      $or: [
        { courseCode: req.body.courseCode },
        { courseTitle: req.body.courseTitle },
      ],
    });

    if (existingCourse) {
      if (existingCourse.courseCode === req.body.courseCode) {
        return res
          .status(409)
          .json({ error: 'Course code already exists in this department' });
      }
      if (existingCourse.courseTitle === req.body.courseTitle) {
        return res
          .status(409)
          .json({ error: 'Course title already exists in this department' });
      }
    }

    // update the course in one step
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, schoolId }, // Ensure the course belongs to the user's school and department
      { $set: req.body },
      { new: true, runValidators: true } // Return updated doc & validate
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Failed to update course' });
    }

    return res.status(200).json({
      message: 'Course updated successfully',
      course: updatedCourse,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.deleteCourse = async (req, res) => {
  try {
    const { schoolId } = req.user;
    const { courseId } = req.params;

    const course = await Course.findOneAndDelete({ courseId, schoolId });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
