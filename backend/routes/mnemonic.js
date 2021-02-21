const express = require("express");
const Mnemonic = require("../models/Mnemonic");
const auth = require("../middlewares/auth");
const router = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;
const User = require("../models/User");
const Category = require("../models/Category");
const { mnemonicSchema } = require("../config/validation");

router.get("/", async (req, res) => {
  let query = { isPublished: true };

  // search queries
  const { author = "", page = 1, search = "" } = req.query;
  const limit = 5;
  let skip = 0;
  if (page > 1) skip = (page - 1) * limit;

  try {
    if (author && ObjectId.isValid(author)) {
      const user = await User.findById(author);
      if (user) query.author = author;
    }

    if (search) query.$text = { $search: search };

    await Mnemonic.find(query)
      .populate({ path: "author", select: "-password" })
      .skip(skip)
      .limit(limit)
      .exec((error, allMnemonics) => {
        if (error) throw new Error(error);
        const mnemonics = allMnemonics.filter(
          (mnemonic) => mnemonic.author.activated
        );
        res.json(mnemonics);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // check if id is valid
  if (!ObjectId.isValid(id))
    return res.status(400).json({ error: "Id is not valid" });

  // check if mnemonic exists
  try {
    await Mnemonic.findOne({
      _id: id,
      isPublished: true,
    })
      .populate({ path: "author", select: "-password" })
      .exec((error, mnemonic) => {
        if (error) throw new Error(error);

        if (!mnemonic || !mnemonic.author.activated)
          return res.status(404).json({ error: "Mnemonic does not exist" });

        res.json(mnemonic);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = mnemonicSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const categories = await validateCategories(req.body.categories);
  if (!categories)
    return res.status(400).json({ error: "Categories are not valid" });

  try {
    req.body = {
      ...req.body,
      categories,
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
  const { title, content } = req.body;
  const { id: mnemonicId } = req.params;

  const { error } = mnemonicSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const categories = await validateCategories(req.body.categories);
  if (!categories)
    return res.status(400).json({ error: "Categories are not valid" });

  // id is valid
  if (!ObjectId.isValid(mnemonicId))
    return res.status(400).json({ error: "Id is not valid" });

  // update
  try {
    // is mnemonic exists
    const mnemonic = await Mnemonic.findById(mnemonicId);
    if (!mnemonic)
      return res.status(400).json({ error: "Mnemonic does not exist" });

    // user is the owner of this mnemonic
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

router.delete("/:id", auth, async (req, res) => {
  const { id: mnemonicId } = req.params;

  // is id valid
  if (!ObjectId.isValid(mnemonicId))
    return res.status(400).json({ error: "Id is not valid" });

  try {
    // is mnemonic exists
    const mnemonic = await Mnemonic.findById(mnemonicId);
    if (!mnemonic)
      return res.status(400).json({ error: "Mnemonic does not exist" });

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

router.put("/like/:id", auth, async (req, res) => {
  const { _id: userId } = req.user;
  const { id: mnemonicId } = req.params;

  // if mnemonic id is valid
  if (!ObjectId.isValid(mnemonicId))
    return res.status(400).json({ error: "Id is not valid" });

  try {
    // is mnemonic exists
    let mnemonic = await Mnemonic.findById(mnemonicId);
    if (!mnemonic)
      return res.status(400).json({ error: "Mnemonic does not exist" });

    // if mnemonic exists
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

// validate if cateogories exist and not duplicated
const validateCategories = async (categories) => {
  const cateogriesList = [];

  // get only not duplicated
  categories.map((categoryId) => {
    if (!cateogriesList.some((id) => id === categoryId))
      cateogriesList.push(categoryId);
  });

  // validate if categories exist
  for (let i = 0; i < cateogriesList.length; i++) {
    const categoryId = cateogriesList[i];
    if (!ObjectId.isValid(categoryId)) return false;

    try {
      const category = await Category.findById(categoryId);
      if (!category) return false;
    } catch (error) {
      throw new Error(error);
    }
  }

  return cateogriesList;
};

module.exports = router;
