const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

// get the login page
router.get("/login", authController.getLoginPage);

router.post("/login-user", authController.postLoginUser);

// get the signup page
router.get("/signup", authController.getSignupPage);

// create a new user account
router.post("/add-user", authController.add_user);

//logout
router.post("/logout", authController.postLogout);

// get the reset password page
router.get("/reset-password", authController.getResetPasswordPage);

// reset password post req
router.post("/reset-password", authController.postResetPassword);

// reset password with token on param
router.get("/reset-password/:token", authController.getNewPasswordPage);

// reset password to new password
router.post("/new-password", authController.postNewPassword);

module.exports = router;
