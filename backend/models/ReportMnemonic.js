const mongoose = require("mongoose");

const schema = mongoose.Schema({
  mnemonic: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "mnemonic",
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

const ReportMnemonic = new mongoose.model("reportMnemonic", schema);

module.exports = ReportMnemonic;
