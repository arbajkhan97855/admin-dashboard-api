const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Token required", authenticated : false });
    }

    const decoded = jwt.verify(token, process.env.MY_SECRECT_KEY);

    req.admin = decoded; 
    next();
  } catch (error) {
     res.clearCookie("token");
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({ message: "Invalid or expired token", authenticated : false });
  }
};
