const mongoose = require("mongoose");

const schema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "user",
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  numberLikes: {
    type: Number,
    default: 0,
  },
  categories: {
    type: [mongoose.Schema.ObjectId],
    ref: "category",
  },
});

const Mnemonic = new mongoose.model("mnemonic", schema);

module.exports = Mnemonic;
