const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "upload/emailAttachments/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.floor(Math.random() * 1000);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});


const upload = multer({
  storage
});

module.exports = upload;
