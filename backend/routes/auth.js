const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { createToken } = require("../config/jwt");
const User = require("../models/User");
const {
  authSchema,
  registerSchema,
  validateData,
} = require("../config/validation");

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password, keepLogin } = req.body;

  // validation
  validateData(req, res, authSchema);

  // check if email and password are valid
  let user;
  try {
    user = await User.findOne({ email });
    const message = "Email or Password doesn't exist";

    if (!user) return res.status(404).json({ error: message });

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) return res.status(404).json({ error: message });

    // create token
    const token = createToken(user, keepLogin);

    // send token
    res.json(token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  const { fullname, username, email, password } = req.body;

  validateData(req, res, registerSchema);

  try {
    // check if user already exists
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (user)
      return res
        .status(400)
        .json({ error: "Username or email already exists" });

    // register
    const newUser = await new User({ fullname, username, email, password });
    newUser.password = await encryptPassword(password);
    await newUser.save();
    res.json({
      user: {
        fullname,
        email,
        username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports = router;
