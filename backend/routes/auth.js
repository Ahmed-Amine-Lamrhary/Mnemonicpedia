const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { createToken, cookieOptions, expires } = require("../config/jwt");
const User = require("../models/User");
const {
  authSchema,
  registerSchema,
  validateData,
} = require("../config/validation");

const sendEmail = require("../config/email");

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password, keepLogin } = req.body;
  let cookieOptionsClone = cookieOptions;

  if (!keepLogin)
    cookieOptionsClone = {
      ...cookieOptions,
      expires: new Date(Date.now() + expires),
    };

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
    const token = createToken(user);

    // send in token httponly cookie
    res.cookie("token", token, cookieOptionsClone).json({ meId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.cookie("token", "deleted", cookieOptions).json("user logged out");
});

// REGISTER
router.post("/register", async (req, res) => {
  const { fullname, username, email, password } = req.body;

  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

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

    // send activation email
    await sendEmail(email, "This is test", "register", { name: fullname });

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
