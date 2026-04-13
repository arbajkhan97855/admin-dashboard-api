const express = require("express")
const {verifyToken} = require("../../../middleware/jwt")
const { GetFAQ, SingleFAQ, CreateFAQ, UpdateFAQ, DeleteFAQ } = require("../../../controller/FAQ/FAQController")



const FAQRouter = express.Router()
 
FAQRouter.get("/getAllFAQ", verifyToken, GetFAQ);
FAQRouter.get("/getFAQ/:id", verifyToken, SingleFAQ);
FAQRouter.post("/addFAQ", verifyToken, CreateFAQ);
FAQRouter.put("/editFAQ/:id", verifyToken, UpdateFAQ);
FAQRouter.delete("/deleteFAQ/:id", verifyToken, DeleteFAQ);


module.exports = FAQRouter