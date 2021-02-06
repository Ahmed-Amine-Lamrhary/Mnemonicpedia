const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");
const { createToken } = require("../config/jwt");
const {
  registerSchema,
  updateMeSchema,
  validateData,
} = require("../config/validation");

router.post("/", async (req, res) => {
  const { fullname, username, email, password } = req.body;

  const error = validateData(req.body, registerSchema);
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

router.put("/", auth, async (req, res) => {
  const { fullname, username, email, password } = req.body;

  const error = validateData(req.body, updateMeSchema);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    if (!fullname && !username && !email && !password)
      return res.status(304).send();

    const user = await User.findById(req.user._id);
    if (fullname) user.fullname = fullname;
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await encryptPassword(password);
    await user.save();
    const token = createToken(user);
    res.json({ token, message: "Your changes were made successully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/", auth, async (req, res) => {
  const { _id } = req.user;

  try {
    await User.deleteOne({ _id });
    res.json({
      user: {
        _id,
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
