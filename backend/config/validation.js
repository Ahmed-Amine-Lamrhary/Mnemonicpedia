const Joi = require("joi");

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  keepLogin: Joi.bool(),
});

const categorySchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
});

const registerSchema = Joi.object({
  fullname: Joi.string().min(3).max(30).required(),
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  password2: Joi.ref("password"),
});

const activateSchema = Joi.object({
  email: Joi.string().email().required(),
  secretNumber: Joi.string().required(),
});

const updateMeSchema = Joi.object({
  fullname: Joi.string().allow("").min(3).max(30),
  username: Joi.string().allow("").min(3).max(30),
  email: Joi.string().allow("").email(),
  password: Joi.string().allow("").pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  password2: Joi.ref("password"),
});

const mnemonicSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  content: Joi.string().min(10).max(1000).required(),
  categories: Joi.array().items(Joi.string()).allow(null),
});

const reportMnemonicSchema = Joi.object({
  title: Joi.string().min(3).max(20).required(),
  content: Joi.string().min(20).max(200).required(),
});

const reportUserSchema = Joi.object({
  title: Joi.string().min(3).max(20).required(),
  content: Joi.string().min(20).max(200).required(),
});

module.exports = {
  authSchema,
  categorySchema,
  registerSchema,
  activateSchema,
  updateMeSchema,
  mnemonicSchema,
  reportMnemonicSchema,
  reportUserSchema,
};
