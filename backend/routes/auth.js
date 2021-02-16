const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { createToken, cookieOptions, expires } = require("../config/jwt");
const User = require("../models/User");
const Registered = require("../models/Registered");
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

    // is user activated
    if (!user.activated) return res.status(200).json({ activated: false });

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

    /////////// start transaction
    // register
    const newUser = await new User({ fullname, username, email, password });
    newUser.password = await encryptPassword(password);
    const { email: userEmail } = await newUser.save();

    // add to registered collection
    const secretNumber = "12345";
    const registered = await new Registered({ email: userEmail, secretNumber });
    await registered.save();

    // send activation email
    await sendEmail(email, "This is test", "register", {
      name: fullname,
      secretNumber,
    });
    /////////// end transaction

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

// ACTIVATE EMAIL
router.post("/activate", async (req, res) => {
  const { email, secretNumber } = req.body;

  // validate data

  try {
    // is user in registered and user collections
    const registeredUser = await Registered.findOne({ email });
    const user = await User.findOne({ email });

    if (!registeredUser || !user)
      return res.status(400).json({ error: "User doesn't exist" });

    // compare secret number
    if (registeredUser.secretNumber !== secretNumber)
      return res.status(400).json({ error: "Secret number is invalid" });

    // activate user and remove it from registered collection
    user.activated = true;
    await Registered.deleteOne({ email: registeredUser.email });
    await user.save();

    res.json({
      user: {
        fullname: user.fullname,
        email: user.email,
        username: user.username,
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
