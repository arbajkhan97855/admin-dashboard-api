const express = require("express")
const cors = require("cors")
const path = require("path")
const cookieParser = require("cookie-parser");

require("dotenv").config();
const db = require("./config/db")
const admin = require("./router/admin/admin")
const app = express()

// Serve static files with absolute path and CORS headers (download pdf ke liye)
app.use(
  "/upload",
  express.static(path.join(__dirname, "upload"), {
    setHeaders: (res, path, stat) => {
      res.set("Access-Control-Allow-Origin", "http://localhost:5173");
      res.set("Access-Control-Allow-Credentials", "true");
    },
  })
);

// app.use("/upload", express.static("upload")) normal use ke liye


app.use(express.json())
app.use(express.urlencoded({extended : false}))
// cookies
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(cookieParser());
// cookies

app.use("/api/admin", admin)

app.listen(process.env.PORT, ()=>{
  console.log(`server started = ${process.env.PORT}` );
})