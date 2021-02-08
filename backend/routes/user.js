const express = require("express");
const router = express.Router();
const User = require("../models/User");

const { getAll, getItem } = require("../middlewares/crud");

router.get("/", async (req, res) =>
  getAll(User, { query: {}, select: "-password" }, res)
);

router.get("/:id", async (req, res) =>
  getItem(User, req, res, {}, "-password")
);

module.exports = router;
