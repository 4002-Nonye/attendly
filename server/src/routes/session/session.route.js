const express = require('express');
const requireLogin = require('../../middlewares/requireLogin');
const { requireStudentAccess, requireLecturerAccess } = require('../../middlewares/roleAccess');
const { getActiveSessionsForStudent, getActiveSessionsForLecturer, endSession } = require('../../controllers/session/session.controller');

const sessionRoute = express.Router();

sessionRoute.get('/active/student',requireLogin,requireStudentAccess,getActiveSessionsForStudent)
sessionRoute.get('/active/lecturer',requireLogin,requireLecturerAccess,getActiveSessionsForLecturer)

// end attendance session
sessionRoute.patch('/:id/end',requireLogin,requireLecturerAccess,endSession)

module.exports=sessionRoute