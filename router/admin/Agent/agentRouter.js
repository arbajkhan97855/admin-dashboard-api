const express = require("express")
const {verifyToken} = require("../../../middleware/jwt")
const upload = require("../../../middleware/upload")
const { GetAgency, SingelAgency, CreateAgency, DeleteAgency, UpdateAgency } = require("../../../controller/Agent/agentController")


const AgencyRouter = express.Router()

AgencyRouter.get("/getAllAgency",verifyToken, GetAgency)
AgencyRouter.get("/getAgency/:id",verifyToken, SingelAgency)
AgencyRouter.post("/addAgency", verifyToken, upload.fields(
[
    { name : "Logo", maxCount : 1},
    { name : "License", maxCount : 1},
    { name : "ID_Proof", maxCount : 1}
]), CreateAgency)
AgencyRouter.put("/editAgency/:id", verifyToken, upload.fields(
[
    { name : "Logo", maxCount : 1},
    { name : "License", maxCount : 1},
    { name : "ID_Proof", maxCount : 1}
]), UpdateAgency)
AgencyRouter.delete("/deleteAgency/:id", verifyToken, DeleteAgency)





module.exports = AgencyRouter