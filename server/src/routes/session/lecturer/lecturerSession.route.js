const express = require('express');
const { getActiveSessionsForLecturer, endSession } = require('../../../controllers/session/session.controller');
const { requireLecturerAccess } = require('../../../middlewares/roleAccess');
const requireLogin = require('../../../middlewares/requireLogin');



const lecturerSessionRoute = express.Router();

// get active sessions for lecturer
lecturerSessionRoute.get('/active',requireLogin,requireLecturerAccess,getActiveSessionsForLecturer)

// end attendance session
lecturerSessionRoute.patch('/:sessionId/end',requireLogin,requireLecturerAccess,endSession)

// Lecturer get session 


module.exports=lecturerSessionRoute