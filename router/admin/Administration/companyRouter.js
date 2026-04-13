const express = require("express")
const { GetCompany, CreateCompany, UpdateCompany, DeleteCompany, SingleCompany } = require("../../../controller/Administration/companyController")
const {verifyToken} = require("../../../middleware/jwt")

const CompanyRouter = express.Router()



CompanyRouter.get("/getAllCompany", verifyToken, GetCompany)
CompanyRouter.get("/getCompany/:id", verifyToken,  SingleCompany)
CompanyRouter.post("/addCompany", verifyToken, CreateCompany)
CompanyRouter.put("/editCompany/:id", verifyToken,  UpdateCompany)
CompanyRouter.delete("/deleteCompany/:id", verifyToken,  DeleteCompany)
module.exports = CompanyRouter