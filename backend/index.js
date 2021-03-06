const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth");
const me = require("./routes/me");
const user = require("./routes/user");
const mnemonic = require("./routes/mnemonic");
const category = require("./routes/category");
const report = require("./routes/report");
const admin = require("./routes/admin");

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());

// routes
app.use("/auth", auth);
app.use("/me", me);
app.use("/user", user);
app.use("/mnemonic", mnemonic);
app.use("/category", category);
app.use("/report", report);
app.use("/admin", admin);

const uri =
  "mongodb+srv://amine123:samirisamiri@cluster.zb5o8.mongodb.net/ourapp?retryWrites=true&w=majority";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to database"))
  .catch((error) => console.error(error));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));
