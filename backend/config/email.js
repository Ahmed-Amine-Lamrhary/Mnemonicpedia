const nodemailer = require("nodemailer");
const Email = require("email-templates");
const secret = require("../secret");

// transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: secret.email.host,
    pass: secret.email.password,
  },
});

// Email Template
const email = new Email({
  transport: transporter,
  send: true,
  preview: false,
});

// send email
const sendEmail = async (to, from, template, locals) => {
  await email.send({
    template,
    message: { from, to },
    locals,
  });
};

module.exports = sendEmail;
