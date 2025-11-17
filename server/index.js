const express = require('express');

require('./src/models/user.model');
require('./src/models/course.model');
require('./src/models/faculty.model');
require('./src/models/department.model');
require('./src/models/school.model');
require('./src/models/studentEnrollment.model');
require('./src/models/session.model');
require('./src/models/attendance.model');
require('./src/models/academicYear.model');

const localAuthRoute = require('./src/routes/auth/localAuth.route');
const oAuthRoute = require('./src/routes/auth/oAuth.route');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const passport = require('passport');
const connectDB = require('./src/lib/db');
const facultyRoute = require('./src/routes/faculty/faculty.route');
const departmentRoute = require('./src/routes/department/department.route');

const adminCourseRoute = require('./src/routes/course/admin/adminCourse.route');
const lecturerCourseRoute = require('./src/routes/course/lecturer/lecturerCourse.route');
const studentCourseRoute = require('./src/routes/course/student/studentCourse.route');
const generalCourseRoute = require('./src/routes/course/general/course.route');
const lecturerSessionRoute = require('./src/routes/session/lecturer/lecturerSession.route');
const studentSessionRoute = require('./src/routes/session/student/studentSession.route');
const schoolRoute = require('./src/routes/school/school.route');

const adminStatsRoute = require('./src/routes/dashboardStats/admin/adminStats.route');
const lecturerStatsRoute = require('./src/routes/dashboardStats/lecturer/lecturerStats.route');
const generalStatsRoute = require('./src/routes/dashboardStats/general/generalStats.route');
const studentStatsRoute = require('./src/routes/dashboardStats/student/studentStats.route');
const userRoute = require('./src/routes/user/user.route');
const lecturerAttendanceRoute = require('./src/routes/attendance/lecturer/lecturerAttendance.route');


require('./src/lib/passport');

// CONFIGURATION
require('dotenv').config();
const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', localAuthRoute);
app.use('/auth/google', oAuthRoute);
app.use('/api/courses', generalCourseRoute);
app.use('/api/admin/courses', adminCourseRoute);
app.use('/api/lecturer/courses', lecturerCourseRoute);
app.use('/api/student/courses', studentCourseRoute);
app.use('/api/faculties', facultyRoute);
app.use('/api/departments', departmentRoute);
app.use('/api/lecturer/sessions', lecturerSessionRoute);
app.use('/api/student/sessions', studentSessionRoute);
app.use('/api/schools', schoolRoute);
app.use('/api/admin/dashboard', adminStatsRoute);
app.use('/api/lecturer/dashboard', lecturerStatsRoute);
app.use('/api/dashboard', generalStatsRoute);
app.use('/api/student/dashboard', studentStatsRoute);
app.use('/api/users',userRoute)
app.use('/api/lecturer/attendance',lecturerAttendanceRoute)

app.listen(process.env.PORT, () => {
  // Connect to the database after server starts
  console.log(process.env.PORT);
  connectDB();
});
