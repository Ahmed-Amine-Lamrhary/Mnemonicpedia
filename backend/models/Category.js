const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

schema.index({ name: "text" });

const Category = new mongoose.model("category", schema);

module.exports = Category;
