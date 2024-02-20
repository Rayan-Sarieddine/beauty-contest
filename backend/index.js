const express = require("express");
const app = express();

require("dotenv").config();

app.use(express.json());

const fileUpload = require("express-fileupload");
app.use(fileUpload());
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const cors = require("cors");
app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.listen(8000, () => {
  console.log("live");
});
