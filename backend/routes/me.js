const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middlewares/auth");
const { createToken } = require("../config/jwt");
const { updateMeSchema } = require("../config/validation");

router.get("/", auth, async (req, res) => {
  const { _id: userId } = req.user;

  try {
    const user = await User.findById(userId);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/", auth, async (req, res) => {
  const { fullname, username, email, password } = req.body;

  const { error } = updateMeSchema.validate(req.body);
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

module.exports = router;
