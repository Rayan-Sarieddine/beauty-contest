const express = require("express");
const { login, register, verify } = require("../controllers/auth.controllers");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/verify", verify);
module.exports = router;
