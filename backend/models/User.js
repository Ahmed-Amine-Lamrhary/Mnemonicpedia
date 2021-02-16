const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },
  activated: {
    type: Boolean,
    default: false,
  },
});

const User = new mongoose.model("user", schema);

module.exports = User;
