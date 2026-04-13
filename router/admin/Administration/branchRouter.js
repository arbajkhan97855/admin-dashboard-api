const express = require("express")
const { GetBranch, CreateBranch, UpdateBranch, DeleteBranch, SingleBranch } = require("../../../controller/Administration/branchController")
const {verifyToken} = require("../../../middleware/jwt")


const BranchRouter = express.Router()


BranchRouter.get("/getAllBranch",verifyToken, GetBranch)
BranchRouter.get("/getBranch/:id",verifyToken, SingleBranch)
BranchRouter.post("/addBranch",verifyToken, CreateBranch)
BranchRouter.put("/editBranch/:id",verifyToken, UpdateBranch)
BranchRouter.delete("/deleteBranch/:id",verifyToken, DeleteBranch)

module.exports = BranchRouter