const express = require("express");
const {
  login,
  register,
  verify,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controllers");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/verify", verify);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
module.exports = router;
