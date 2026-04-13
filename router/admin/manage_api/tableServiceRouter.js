const express = require("express")
const {verifyToken} = require("../../../middleware/jwt");
const { GetAllService, SingleService, CreateService, UpdateService, DeleteService } = require("../../../controller/manage_api/tableServiceController");




const ServiceRouter = express.Router()
 
ServiceRouter.get("/getAllService", verifyToken, GetAllService);
ServiceRouter.get("/getService/:id", verifyToken, SingleService);
ServiceRouter.post("/addService", verifyToken, CreateService);
ServiceRouter.put("/editService/:id", verifyToken, UpdateService);
ServiceRouter.delete("/deleteService/:id", verifyToken, DeleteService);


module.exports = ServiceRouter