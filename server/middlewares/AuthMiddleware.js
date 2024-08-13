const jwt = require("jsonwebtoken");
const env = require("dotenv");
exports.isAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(400).json({ message: "no token" });
  }
  const docoded = await jwt.verify(token, process.env.JWT_SECRET);
  if (!docoded) {
    return res.status(400).json({ message: "no authurized" });
  }
  req.userId = docoded.userId;
  next();
};
