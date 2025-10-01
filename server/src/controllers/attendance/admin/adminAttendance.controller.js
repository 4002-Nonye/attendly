
exports.getAdminAttendanceReport = async (req, res) => {
  // accepts filters: facultyId, departmentId, level, courseId
  // returns student id -> name -> sessions total -> attended total -> % attended -> eligible
};

exports.downloadAdminAttendanceReport = async (req, res) => {
  // accepts filters: facultyId, departmentId, level, courseId
  // returns downloadable PDF across chosen scope
};