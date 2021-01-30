const mongoose = require("mongoose");

const schema = mongoose.Schema({
  reported: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "user",
  },
  author: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "user",
  },
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
});

const ReportUser = new mongoose.model("reportUser", schema);

module.exports = ReportUser;
