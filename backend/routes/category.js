const express = require("express");
const Category = require("../models/Category");
const auth = require("../middlewares/auth");
const router = express.Router();
const { categorySchema, validateData } = require("../config/validation");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().select("name");
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  const { name } = req.body;

  const error = validateData(req.body, categorySchema);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const category = await Category.findOne({ name });
    if (category)
      return res.status(400).json({ error: "Category name already exists" });

    const newCategory = new Category({
      name,
    });
    await newCategory.save();
    res.json({
      category: {
        id: newCategory._id,
        name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
