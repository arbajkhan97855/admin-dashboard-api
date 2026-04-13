const express = require("express")
const { GetEmployee, CreateEmployee, UpdateEmployee, DeleteEmployee, SingleEmployee } = require("../../../controller/Administration/employeeController")
const {verifyToken} = require("../../../middleware/jwt")

const EmployeeRouter = express.Router()


EmployeeRouter.get("/getAllEmployee",verifyToken, GetEmployee)
EmployeeRouter.get("/getEmployee/:id",verifyToken, SingleEmployee)
EmployeeRouter.post("/addEmployee",verifyToken, CreateEmployee)
EmployeeRouter.put("/editEmployee/:id",verifyToken, UpdateEmployee)
EmployeeRouter.delete("/deleteEmployee/:id",verifyToken, DeleteEmployee)
module.exports = EmployeeRouter