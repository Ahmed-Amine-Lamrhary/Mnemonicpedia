const express = require("express");
const router = express.Router();
const ReportMnemonic = require("../models/ReportMnemonic");
const ReportUser = require("../models/ReportUser");
const auth = require("../middlewares/auth");
const { reportUserSchema } = require("../config/validation");

router.post("/mnemonic/:id", auth, async (req, res) => {
  const { title, content } = req.body;
  const { id: mnemonicId } = req.params;
  const { _id: userId } = req.user;

  // validate data
  const { error } = reportMnemonicSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // is id valid
  if (!ObjectId.isValid(mnemonicId))
    return res.status(400).json({ error: "Id is not valid" });

  try {
    // check if mnemonic exists and doesn't belong to him
    const mnemonic = await Mnemonic.findOne({
      _id: mnemonicId,
      isPublished: true,
      author: { $ne: userId },
    });
    if (!mnemonic)
      return res.status(404).json({
        error: "Mnemonic is not available or user is not allowed to report it.",
      });

    // report
    const data = { mnemonic: mnemonicId, author: userId, title, content };
    const reportMnemonic = new ReportMnemonic(data);
    await reportMnemonic.save();
    res.json({
      reportMnemonic: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/user/:id", auth, async (req, res) => {
  const { title, content } = req.body;
  const { id: reportedUserId } = req.params;
  const { _id: userId } = req.user;

  // validate data
  const { error } = reportUserSchema.validate(req.body);

  // is id valid
  if (!ObjectId.isValid(reportedUserId))
    return res.status(400).json({ error: "Id is not valid" });

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
