const express = require("express")
const { Postlogin, CheckAuth } = require("../../../controller/Login/adminController")
const {verifyToken} = require("../../../middleware/jwt")


const AdminRouter = express.Router()

AdminRouter.post("/loginAdmin", Postlogin)
AdminRouter.get("/check_auth",verifyToken, CheckAuth)
module.exports = AdminRouter