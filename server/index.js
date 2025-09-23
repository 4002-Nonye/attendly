const express = require('express');

require('./src/models/user.model');
require('./src/models/course.model');
require('./src/models/faculty.model')
require('./src/models/department.model')
require('./src/models/school.model')
require('./src/models/studentReg.model')
//require('./src/models/attendanceReg.model')

const localAuthRoute = require('./src/routes/auth/localAuth.route');
const oAuthRoute = require('./src/routes/auth/oAuth.route');
const cookieParser = require('cookie-parser');

const passport = require('passport');
const connectDB = require('./src/lib/db');
const courseRoute = require('./src/routes/course/course.route');
const facultyRoute = require('./src/routes/faculty/faculty.route');
const departmentRoute = require('./src/routes/department/department.route');
const  userRoute = require('./src/routes/user/user.route');


require('./src/lib/passport');

require('dotenv').config();



const cors = require('cors');


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
app.use('/api/courses',courseRoute)
app.use('/api/faculties',facultyRoute)
app.use('/api/departments',departmentRoute)
app.use('/api/users',userRoute)











app.listen(process.env.PORT, () => {
  // Connect to the database after server starts
  console.log(process.env.PORT);
  connectDB();
});
