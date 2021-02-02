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
  likes: {
    type: Array,
    default: [mongoose.Schema.ObjectId],
    ref: "user",
  },
  categories: {
    type: [mongoose.Schema.ObjectId],
    ref: "category",
  },
});

schema.index({ content: "text" });

const Mnemonic = new mongoose.model("mnemonic", schema);

module.exports = Mnemonic;
