const express = require("express")
const { GetDepartment, CreateDepartment, UpdateDepartment, DeleteDepartment, SingleDepartment } = require("../../../controller/Administration/departmentController")
const {verifyToken} = require("../../../middleware/jwt")

const DepartmentRouter = express.Router()


DepartmentRouter.get("/getAllDepartment",verifyToken, GetDepartment)
DepartmentRouter.get("/getDepartment/:id",verifyToken, SingleDepartment)
DepartmentRouter.post("/addDepartment",verifyToken, CreateDepartment)
DepartmentRouter.put("/editDepartment/:id",verifyToken, UpdateDepartment)
DepartmentRouter.delete("/deleteDepartment/:id",verifyToken, DeleteDepartment)

module.exports = DepartmentRouter