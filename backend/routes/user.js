const express = require("express");
const router = express.Router();
const User = require("../models/User");
const ObjectId = require("mongoose").Types.ObjectId;
const ReportUser = require("../models/ReportUser");
const Joi = require("joi");
const auth = require("../middlewares/auth");

const reportSchema = Joi.object({
  title: Joi.string().min(3).max(20).required(),
  content: Joi.string().min(20).max(200).required(),
});

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

router.post("/report/:id", auth, async (req, res) => {
  const { title, content } = req.body;
  const { id: reportedUserId } = req.params;
  const { _id: userId } = req.user;

  // validate data
  const error = validateData(req.body, reportSchema);
  if (error) return res.status(400).json({ error: error.details[0].message });

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
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const validateData = (data, schema) => {
  const { error } = schema.validate(data);
  if (error) return error;
};

module.exports = router;
