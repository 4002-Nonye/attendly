const express = require('express')
const requireLogin = require('../../middlewares/requireLogin')
const {  addDepartment, editDepartment, deleteDepartment, getDepartmentStats } = require('../../controllers/department/department.controller')
const { requireAdminAccess } = require('../../middlewares/roleAccess')

const departmentRoute=express.Router()


departmentRoute.get('/',requireLogin,requireAdminAccess,getDepartmentStats)

departmentRoute.post('/',requireLogin,requireAdminAccess,addDepartment)
departmentRoute.put('/:id',requireLogin,requireAdminAccess,editDepartment)
departmentRoute.delete('/:id',requireLogin,requireAdminAccess,deleteDepartment)


module.exports=departmentRoute