const express = require("express")
const { GetTravelPolicy, CreateTravelPolicy, SingleTravelPolicy, UpdateTravelPolicy } = require("../../../controller/Travel_Policy/travelPolicyController")

const {verifyToken} = require("../../../middleware/jwt")
const TravelPolicyRouter = express.Router()


TravelPolicyRouter.get("/getAllTravelPolicy", verifyToken, GetTravelPolicy)
TravelPolicyRouter.get("/getTravelPolicy/:id", verifyToken, SingleTravelPolicy)
TravelPolicyRouter.post("/addTravelPolicy", verifyToken, CreateTravelPolicy )
TravelPolicyRouter.put("/editTravelPolicy/:id", verifyToken, UpdateTravelPolicy )



module.exports = TravelPolicyRouter