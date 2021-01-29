const express = require("express");
const router = express.Router();
const User = require("../models/User");
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // check if id is valid
  if (!ObjectId.isValid(id))
    return res.status(400).json({ error: "Id is not valid" });

  // check if user exists
  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ error: "User does not exist" });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
