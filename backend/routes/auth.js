const express = require("express");
const router = express.Router();
const Joi = require("joi");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { createToken } = require("../config/jwt");

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  keepLogin: Joi.bool(),
});

router.post("/", async (req, res) => {
  const { email, password, keepLogin } = req.body;

  // validation
  const { error } = authSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // check if email and password are valid
  let user;
  try {
    user = await User.findOne({ email });
    const message = "Email or Password doesn't exist";

    if (!user) return res.status(404).json({ error: message });

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) return res.status(404).json({ error: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

  // create token
  const token = createToken(user, keepLogin);

  // send token
  res.send(token);
});

module.exports = router;
