const express = require("express")
const { GetBlog, SingleBlog, CreateBlog, DeleteBlog, UpdateBlog } = require("../../../controller/Blog/blogController")
const {verifyToken} = require("../../../middleware/jwt")
const upload = require("../../../middleware/upload")


const BlogRouter = express.Router()

BlogRouter.get("/getAllBlog",verifyToken, GetBlog)
BlogRouter.get("/getBlog/:id",verifyToken, SingleBlog)
BlogRouter.post("/addBlog", verifyToken, upload.single("Image"), CreateBlog)
BlogRouter.delete("/deleteBlog/:id", verifyToken, DeleteBlog)
BlogRouter.put("/editBlog/:id", verifyToken, upload.single("Image"), UpdateBlog)



module.exports = BlogRouter