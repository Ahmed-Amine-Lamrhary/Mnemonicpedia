const jwt = require("jsonwebtoken");

const secretKey = "jwt-secret-key";

const expires = 7200000; // in 2h

const cookieOptions = {
  httpOnly: true,
  secure: false,
};

const createToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
    },
    secretKey
  );
};

module.exports = {
  secretKey,
  createToken,
  cookieOptions,
  expires,
};
