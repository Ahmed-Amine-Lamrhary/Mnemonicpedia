const express = require("express");
const Mnemonic = require("../models/Mnemonic");
const auth = require("../middlewares/auth");
const router = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;
const ReportMnemonic = require("../models/ReportMnemonic");
const User = require("../models/User");
const {
  mnemonicSchema,
  reportMnemonicSchema,
  validateData,
} = require("../config/validation");

router.get("/", async (req, res) => {
  let query = { isPublished: true };

  // search queries
  const { author = "", page = 1, search = "" } = req.query;
  const size = 5;
  let skip = 0;
  if (page > 1) skip = (page - 1) * size;

  if (author && ObjectId.isValid(author)) {
    try {
      const user = await User.findById(author);
      if (user) query.author = author;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  if (search) query.$text = { $search: search };

  // get mnemonics
  try {
    let mnemonics = await Mnemonic.find(query)
      .skip(skip)
      .limit(size)
      .sort("-dateCreated");

    for (let i = 0; i < mnemonics.length; i++) {
      const mnemonic = mnemonics[i];
      const user = await User.findById(mnemonic.author).select("-password");
      mnemonic.author = user;
    }

    res.json(mnemonics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // check if id is valid
  if (!ObjectId.isValid(id))
    return res.status(400).json({ error: "Id is not valid" });

  // check if mnemonic exists
  try {
    const mnemonic = await Mnemonic.findOne({ _id: id, isPublished: true });
    if (!mnemonic)
      return res.status(404).json({ error: "Mnemonic does not exist" });

    res.json(mnemonic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  const { title, content, categories } = req.body;

  const error = validateData(req.body, mnemonicSchema);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // duplicated categories
  const cateogriesList = [];
  categories.map((category) => {
    if (!cateogriesList.some(({ _id }) => _id === category._id))
      cateogriesList.push(category);
  });

  try {
    const newMnemonic = new Mnemonic({
      title,
      content,
      author: req.user._id,
      categories: cateogriesList,
    });
    await newMnemonic.save();
    res.json({
      mnemonic: {
        id: newMnemonic._id,
        title,
        content,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  // validate data
  const { title, content, categories } = req.body;
  const { id: mnemonicId } = req.params;

  const error = validateData(req.body, mnemonicSchema);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // id is valid
  if (!ObjectId.isValid(mnemonicId))
    return res.status(400).json({ error: "Id is not valid" });

  // update
  try {
    // user is the owner of this mnemonic
    const mnemonic = await Mnemonic.findById(mnemonicId);

    if (!mnemonic.author.equals(req.user._id))
      return res
        .status(401)
        .json({ error: "You are not authorized to update this mnemonic" });

    mnemonic.title = title;
    mnemonic.content = content;
    mnemonic.categories = categories;
    await mnemonic.save();
    res.json(mnemonic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/like", auth, async (req, res) => {
  const { _id: userId } = req.user;
  const {
    data: { _id: mnemonicId },
  } = req.body;

  try {
    let mnemonic = await Mnemonic.findById(mnemonicId);

    if (!mnemonic.likes.includes(userId)) mnemonic.likes.push(userId);
    else mnemonic.likes = mnemonic.likes.filter((like) => like !== userId);

    await mnemonic.save();
    return res.json({
      likes: mnemonic.likes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const { id: mnemonicId } = req.params;

  try {
    const { author } = await Mnemonic.findById(mnemonicId).select(
      "author -_id"
    );

    if (!author.equals(req.user._id))
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this mnemonic" });

    await Mnemonic.deleteOne({ _id: mnemonicId });
    res.json({
      mnemonic: {
        _id: mnemonicId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/report/:id", auth, async (req, res) => {
  const { title, content } = req.body;
  const { id: mnemonicId } = req.params;
  const { _id: userId } = req.user;

  // validate data
  const error = validateData(req.body, reportMnemonicSchema);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // is id given
  if (!mnemonicId) return res.status(400).json({ error: "No id was given" });

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

module.exports = router;
