const express = require('express')
const requireLogin = require('../../middlewares/requireLogin')
const { getDepartments, getDepartmentByID, addDepartment, editDepartment, deleteDepartment } = require('../../controllers/department/department.controller')
const { requireAdminAccess } = require('../../middlewares/roleAccess')

const departmentRoute=express.Router()


departmentRoute.get('/',requireLogin,getDepartments)
departmentRoute.get('/:id',requireLogin,getDepartmentByID)
departmentRoute.post('/',requireLogin,requireAdminAccess,addDepartment)
departmentRoute.put('/:id',requireLogin,requireAdminAccess,editDepartment)
departmentRoute.delete('/:id',requireLogin,requireAdminAccess,deleteDepartment)


module.exports=departmentRoute