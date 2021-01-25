const jwt = require("jsonwebtoken");

const secretKey = "jwt-secret-key";
const expiresIn = "2h";
const createToken = (user, keepLogin) => {
  return jwt.sign(
    {
      fullname: user.fullname,
      username: user.username,
      email: user.email,
    },
    secretKey,
    !keepLogin ? { expiresIn } : null
  );
};

module.exports = {
  secretKey,
  createToken,
};
