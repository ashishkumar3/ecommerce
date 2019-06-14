const express = require("express");
const router = express.Router();

const loginController = require("../controllers/login.controller");

// get the login page
router.get("/login", loginController.get_login);

module.exports = router;
