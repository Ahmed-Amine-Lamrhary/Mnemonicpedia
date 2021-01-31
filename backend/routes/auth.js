const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { createToken } = require("../config/jwt");
const User = require("../models/User");
const { authSchema, validateData } = require("../config/validation");

router.post("/", async (req, res) => {
  const { email, password, keepLogin } = req.body;

  // validation
  const error = validateData(req.body, authSchema);
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
