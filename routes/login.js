const express = require("express");
const router = express.Router();

const loginController = require("../controller/login");

// get the login page
router.get("/login", loginController.get_login);

module.exports = router;
