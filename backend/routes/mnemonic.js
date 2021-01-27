const express = require("express");
const Mnemonic = require("../models/Mnemonic");
const auth = require("../middlewares/auth");
const Joi = require("joi");
const router = express.Router();

const schema = Joi.object({
  title: Joi.string().min(3).max(20).required(),
  content: Joi.string().min(20).max(200).required(),
  categories: Joi.array().items(Joi.object()).allow(null),
});

router.get("/", async (req, res) => {
  try {
    const mnemonics = await Mnemonic.find({ isPublished: true });
    res.json(mnemonics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", auth, async (req, res) => {
  const { title, content, categories } = req.body;

  const error = validateData(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const newMnemonic = new Mnemonic({
      title,
      content,
      author: req.user._id,
      categories,
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
    res.status(500).json({ error: "Internal Server Error" });
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
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/", auth, async (req, res) => {
  const { _id } = req.body;
  if (!_id) return res.status(400).json({ error: "No id was given" });

  const { author } = await Mnemonic.findById(_id).select("author -_id");

  if (!author.equals(req.user._id))
    return res
      .status(401)
      .json({ error: "You are not authorized to delete this mnemonic" });

  try {
    await Mnemonic.deleteOne({ _id });
    res.json({
      mnemonic: {
        _id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const validateData = (data) => {
  const { error } = schema.validate(data);
  if (error) return error;
};

module.exports = router;
