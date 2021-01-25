const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");
const Joi = require("joi");
const { createToken } = require("../config/jwt");

const registerSchema = Joi.object({
  fullname: Joi.string().min(3).max(10).required(),
  username: Joi.string().min(3).max(10).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  password2: Joi.ref("password"),
});

const updateSchema = Joi.object({
  fullname: Joi.string().allow("").min(3).max(10),
  username: Joi.string().allow("").min(3).max(10),
  email: Joi.string().allow("").email(),
  password: Joi.string().allow("").pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  password2: Joi.ref("password"),
});

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
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/", auth, async (req, res) => {
  const { fullname, username, email, password } = req.body;

  const error = validateData(req.body, updateSchema);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    if (!fullname && !username && !email && !password)
      return res.status(304).send();

    const user = await User.findOne({ email: req.user.email });
    if (fullname) user.fullname = fullname;
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await encryptPassword(password);
    await user.save();
    const token = createToken(user);
    res.send(token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/", auth, async (req, res) => {
  const { email } = req.user;

  try {
    await User.deleteOne({ email });
    res.json({
      user: {
        email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const validateData = (data, schema) => {
  const { error } = schema.validate(data);
  if (error) return error;
};

module.exports = router;
