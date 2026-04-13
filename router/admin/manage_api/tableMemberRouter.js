const express = require("express")
const { verifyToken } = require("../../../middleware/jwt");
const { GetMemTbdata, SingleMemTb, CreateMemTb, UpdateMemTb, DeleteMemTb } = require("../../../controller/manage_api/tableMemberController");

const MemberRouter = express.Router()

MemberRouter.get("/getmembers/:service_id", verifyToken, GetMemTbdata);
MemberRouter.get("/getmember/:id", verifyToken, SingleMemTb);
MemberRouter.post("/addmember/:service_id", verifyToken, CreateMemTb);
MemberRouter.put("/editmember/:id", verifyToken, UpdateMemTb);
MemberRouter.delete("/deletemember/:id", verifyToken, DeleteMemTb);

module.exports = MemberRouter