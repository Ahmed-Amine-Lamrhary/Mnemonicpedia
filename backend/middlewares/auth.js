const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/jwt");

module.exports = (req, res, next) => {
  const token = req.headers["x-auth-token"];

  try {
    const user = jwt.verify(token, secretKey);
    req.user = {
      ...user,
      token,
    };
  } catch (error) {
    return res.status(401).json({ error: "You are not authorized." });
  }

  next();
};
