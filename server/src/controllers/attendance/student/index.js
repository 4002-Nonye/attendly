const { markAttendance } = require('./markAttendance');
const { getStudentAttendanceReport } = require('./report');
const { getStudentSessionDetails } = require('./sessionDetails');


module.exports = {
  markAttendance,
  getStudentAttendanceReport,
  getStudentSessionDetails,
  
};