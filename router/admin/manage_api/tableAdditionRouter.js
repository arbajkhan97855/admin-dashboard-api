const express = require("express")
const {verifyToken} = require("../../../middleware/jwt");
const { GetExtraDetail, CreateExtraDetails } = require("../../../controller/manage_api/tableAdditionDetail");

const AdditionDetailRouter = express.Router()
 
AdditionDetailRouter.get("/getExtraDetails/:service_id", verifyToken, GetExtraDetail);
AdditionDetailRouter.post("/addExtraDetails/:service_id", verifyToken, CreateExtraDetails);



module.exports = AdditionDetailRouter