const express = require("express");
const Mnemonic = require("../models/Mnemonic");
const auth = require("../middlewares/auth");
const router = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;
const ReportMnemonic = require("../models/ReportMnemonic");
const User = require("../models/User");
const Category = require("../models/Category");
const {
  mnemonicSchema,
  reportMnemonicSchema,
  validateData,
} = require("../config/validation");

const { getAll, getItem } = require("../middlewares/crud");

router.get("/", async (req, res) => {
  let query = { isPublished: true };

  // search queries
  const { author = "", page = 1, search = "" } = req.query;
  const limit = 5;
  let skip = 0;
  if (page > 1) skip = (page - 1) * limit;

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
  getAll(
    Mnemonic,
    { query, select: "", skip, limit, sort: "-dateCreated" },
    res,
    [
      { RModel: User, field: "author", rselect: "-password" },
      { RModel: Category, field: "categories" },
    ]
  );
});

router.get("/:id", async (req, res) => {
  getItem(Mnemonic, req, res, { isPublished: true }, "", [
    { RModel: User, field: "author", rselect: "-password" },
    { RModel: Category, field: "categories" },
  ]);
});

router.post("/", auth, async (req, res) => {
  validateData(req, res, mnemonicSchema);

  try {
    // duplicated categories
    const cateogriesList = [];
    req.body.categories.map((category) => {
      // validate categories
      // const c = await Category.findById(category._id);
      // if (!c) return res.status(400).json({ error: "Category doesn't exist" });

      if (!cateogriesList.some(({ _id }) => _id === category._id))
        cateogriesList.push(category);
    });

    req.body = {
      ...req.body,
      categories: cateogriesList,
      author: req.user._id,
    };

    const newMnemonic = new Mnemonic(req.body);
    await newMnemonic.save();
    res.json(newMnemonic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  // validate data
  const { title, content, categories } = req.body;
  const { id: mnemonicId } = req.params;

  validateData(req, res, mnemonicSchema);

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
    mnemonic.isPublished = true;
    await mnemonic.save();
    res.json(mnemonic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/like/:id", auth, async (req, res) => {
  const { _id: userId } = req.user;
  const { id: mnemonicId } = req.params;

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

  if (!ObjectId.isValid(mnemonicId))
    return res.status(400).json({ error: "Id is not valid" });

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
  validateData(req, res, reportMnemonicSchema);

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
