const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

// get the login page
router.get("/login", authController.getLoginPage);

// get the signup page
router.get("/signup", authController.getSignupPage);

//logout
router.post("/logout", authController.postLogout);

module.exports = router;
