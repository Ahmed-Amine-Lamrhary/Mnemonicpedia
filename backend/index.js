const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// routes
const auth = require("./routes/auth");
app.use("/auth", auth);
const user = require("./routes/user");
app.use("/user", user);

mongoose
  .connect("mongodb://localhost/ourapp")
  .then(() => console.log("Connected to database"))
  .catch((error) => console.error(error));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));
