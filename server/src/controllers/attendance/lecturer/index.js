const { getLecturerAttendanceOverview } = require('./overview');
const { getLecturerSessionDetails } = require('./sessionDetails');
const { getLecturerSessionStudentDetails } = require('./sessionStudents');
const { getLecturerAttendanceReport } = require('./report');

module.exports = {
  getLecturerAttendanceOverview,
  getLecturerSessionDetails,
  getLecturerSessionStudentDetails,
  getLecturerAttendanceReport,
};