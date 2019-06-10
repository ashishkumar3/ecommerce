const express = require("express");
const router = express.Router();

const loginController = require("../controller/login");

// get the login page
router.get("/login", loginController.get_login);

// login a user
router.post("/login-user", loginController.login_user);

module.exports = router;
