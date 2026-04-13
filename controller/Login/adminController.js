const db = require("../../config/db");
const jwt = require("jsonwebtoken");
require("dotenv/config");

exports.Postlogin = async(req, res) => {
  try {
    const { username, password } = req.body;
     let Username = username.trim()
     let Password =  password.trim()
    if (!username || !password)
      return res.status(404).json({ message: "Please field data" });
    const Admindata =
      "SELECT * FROM superadmin WHERE BINARY username = ? AND BINARY password = ?";
    db.query(Admindata, [Username, Password], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length == 0)
        return res.status(404).json({ message: "Wrong Your Username & Password" });

      const admin = result[0];
      const token = jwt.sign(
        {
          id: admin.id,
          username: admin.username,
        },
        process.env.MY_SECRECT_KEY,
        { expiresIn: process.env.TOKEN_EXPIREIN }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,      
        sameSite: "none",  
        maxAge: 24 * 60 * 60 * 1000,
      });

     //Local TOKEN COOKIE ME SAVE
      // res.cookie("token", token, {
      //   httpOnly: true,
      //   secure: false,       
      //   sameSite: "lax",   
      //   maxAge: 24 * 60 * 60 *  1000 
      // });

      res
        .status(201)
        .json({ message: "Admin Successfull Login" });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.CheckAuth = async(req, res) => {
  res.status(200).json({
    authenticated: true,
    admin: req.admin,
  });
};




