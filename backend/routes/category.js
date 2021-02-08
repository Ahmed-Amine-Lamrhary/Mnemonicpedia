const express = require("express");
const Category = require("../models/Category");
const auth = require("../middlewares/auth");
const router = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;
const { categorySchema, validateData } = require("../config/validation");

const { getAll } = require("../middlewares/crud");

router.get("/", async (req, res) => {
  let query = {};

  // search queries
  const { text = "", exclude } = req.query;
  if (text) query.$text = { $search: text };

  if (exclude) {
    const excludeList = JSON.parse(exclude);
    if (excludeList.length > 0)
      query._id = {
        $nin: excludeList.map((categoryId) => {
          if (ObjectId.isValid(categoryId)) return ObjectId(categoryId);
        }),
      };
  }

  getAll(Category, { query, select: "name" }, res);
});

router.post("/", auth, async (req, res) => {
  const name = req.body.name.toLowerCase();
  validateData(req, res, categorySchema);

  try {
    const category = await Category.findOne({ name });
    if (category)
      return res.status(400).json({ error: "Category name already exists" });

    const newCategory = new Category({ name });
    await newCategory.save();
    res.json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  const name = req.body.name.toLowerCase();
  const { id: categoryId } = req.params;

  validateData(req, res, categorySchema);

  // id is valid
  if (!ObjectId.isValid(categoryId))
    return res.status(400).json({ error: "Id is not valid" });

  try {
    let category = await Category.findOne({ name });
    if (category)
      return res.status(400).json({ error: "Category name already exists" });

    category = await Category.finById(categoryId);
    category.name = name;
    await category.save();
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
