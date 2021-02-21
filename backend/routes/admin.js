const express = require("express");
const router = express.Router();
const user = require("../adminRoutes/user");
// const mnemonic = require("../adminRoutes/mnemonic");
// const category = require("../adminRoutes/category");

router.use(user);
// router.use(mnemonic);
// router.use(category);

module.exports = router;
