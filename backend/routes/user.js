const express = require("express");
const router = express.Router();
const User = require("../models/User");
const ObjectId = require("mongoose").Types.ObjectId;
const ReportUser = require("../models/ReportUser");
const auth = require("../middlewares/auth");
const { reportUserSchema, validateData } = require("../config/validation");

const { getAll, getItem } = require("../middlewares/crud");

router.get("/", async (req, res) =>
  getAll(User, { query: {}, select: "-password" }, res)
);

router.get("/:id", async (req, res) =>
  getItem(User, req, res, {}, "-password")
);

router.post("/report/:id", auth, async (req, res) => {
  const { title, content } = req.body;
  const { id: reportedUserId } = req.params;
  const { _id: userId } = req.user;

  // validate data
  validateData(req, res, reportUserSchema);

  // is id given
  if (!reportedUserId)
    return res.status(400).json({ error: "No id was given" });

  try {
    // check if user exists and is not him
    const user = await User.findOne({
      $and: [{ _id: reportedUserId }, { _id: { $ne: userId } }],
    });
    if (!user)
      return res.status(404).json({
        error: "User is not available or user is not allowed to report it.",
      });

    // report
    const data = { reported: reportedUserId, author: userId, title, content };
    const reportUser = new ReportUser(data);
    await reportUser.save();
    res.json({
      reportUser: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
