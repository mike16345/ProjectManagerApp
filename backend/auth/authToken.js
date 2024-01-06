const jwt = require("jsonwebtoken");

const JWT_SECRET = "dsfasefs$$WT#T#$T#$T$#^%GESG$%U*&^IVSDGRTG$E%";

exports.authToken = (req, res, next) => {
  const token = req.header("x-api-key");
  if (!token) {
    res.status(401).json({ msg: "no token" });
  }
  try {
    const decodeToken = jwt.verify(token, JWT_SECRET);
    req.tokenData = decodeToken;
    next();
  } catch (error) {
    res.status(401).json({ msg: "not valid token" });
  }
};
