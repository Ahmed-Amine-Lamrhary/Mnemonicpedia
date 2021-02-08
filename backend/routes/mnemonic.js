const express = require("express");
const Mnemonic = require("../models/Mnemonic");
const auth = require("../middlewares/auth");
const router = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;
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
  const categories = validateCategories(req, res);

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

  validateData(req, res, mnemonicSchema);
  const categories = validateCategories(req, res);

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
const validateCategories = (req, res) => {
  const { categories } = req.body;
  const cateogriesList = [];

  // get only not duplicated
  categories.map((categoryId) => {
    if (!cateogriesList.some((id) => id === categoryId))
      cateogriesList.push(categoryId);
  });

  // validate if categories IDs are valid
  cateogriesList.map((categoryId) => {
    if (!ObjectId.isValid(categoryId))
      return res.status(400).json({ error: "Categories are not valid" });
  });

  // validate if categories exist
  // cateogriesList.map(async (categoryId) => {
  //   try {
  //     const category = await Category.findById(categoryId);
  //     if (!category)
  //       return res.status(400).json({ error: "Categories do not exist" });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ error: error.message });
  //   }
  // });

  return cateogriesList;
};

module.exports = router;
