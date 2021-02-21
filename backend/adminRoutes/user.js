const express = require("express");
const router = express.Router();
const authAdmin = require("../middlewares/authAdmin");
const User = require("../models/User");
const ObjectId = require("mongoose").Types.ObjectId;

const limit = 5;

router.get("/user", authAdmin, async (req, res) => {
  let query = {};

  // search queries
  const {
    active = true,
    suspended = false,
    flagged = false,
    page = 1,
    search = "",
  } = req.query;

  let skip = 0;
  if (page > 1) skip = (page - 1) * limit;

  try {
    if (search) query.$text = { $search: search };

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/user/count", authAdmin, async (req, res) => {
  try {
    const count = await User.count();
    res.json({ count, limit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/user/suspend/:id", authAdmin, async (req, res) => {
  const { id: userId } = req.params;

  // if user id is valid
  if (!ObjectId.isValid(userId))
    return res.status(400).json({ error: "Id is not valid" });

  try {
    // is user exists
    let user = await User.findById(userId);

    if (!user) return res.status(400).json({ error: "User does not exist" });

    user.suspended = !user.suspended;

    await user.save();
    return res.json({
      suspended: user.suspended,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/user", authAdmin, async (req, res) => {});

module.exports = router;
