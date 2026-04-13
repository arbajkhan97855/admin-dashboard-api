const express = require("express");
const { verifyToken } = require("../../../middleware/jwt");
const {
  GetSMTP,
  SingleSMTP,
  CreateSMTP,
  UpdateSMTP,
  DeleteSMTP,
} = require("../../../controller/invoice/smtpController");

const smtpRouter = express.Router();

smtpRouter.get("/getsmtp", verifyToken, GetSMTP);
smtpRouter.get("/getsmtp/:id", verifyToken, SingleSMTP);
smtpRouter.post("/addsmtp", verifyToken, CreateSMTP);
smtpRouter.put("/editsmtp/:id", verifyToken, UpdateSMTP);
smtpRouter.delete("/deletesmtp/:id", verifyToken, DeleteSMTP);

module.exports = smtpRouter;
