const express = require("express")
const {verifyToken} = require("../../../middleware/jwt");
const { GetDetails, CreateDetails, DeleteDetails, UpdateDetail, SingleDetail } = require("../../../controller/manage_api/tableDetailController");



const DetailRouter = express.Router()
 
DetailRouter.get("/getDetails/:service_id", verifyToken, GetDetails);
DetailRouter.get("/getDetail/:id", verifyToken, SingleDetail);
DetailRouter.post("/addDetail/:service_id", verifyToken, CreateDetails);
DetailRouter.put("/editDetail/:id", verifyToken, UpdateDetail);
DetailRouter.delete("/deleteDetail/:id", verifyToken, DeleteDetails);


module.exports = DetailRouter