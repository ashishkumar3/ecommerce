const express = require("express");
const router = express.Router();

const signupController = require("../controller/signup");

// get the signup page
router.get("/signup", signupController.get_signup);

module.exports = router;
