const express = require("express");
const router = express.Router();

const User = require("../models/user");

const authController = require("../controllers/auth.controller");

const { check, body } = require("express-validator");

// get the login page
router.get("/login", authController.getLoginPage);

router.post("/login-user", authController.postLoginUser);

// get the signup page
router.get("/signup", authController.getSignupPage);

// create a new user account
router.post(
  "/signup",
  [
    check("name").trim(),
    check("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Please enter a valid email address")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject("Email address already registered!");
          }
        });
      }),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password should be atleast 6 characters long."),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match!");
      }
      return true;
    })
  ],
  authController.postSignupUser
);

//logout
router.post("/logout", authController.postLogout);

// get the reset password page
router.get("/reset-password", authController.getResetPasswordPage);

// reset password post req
router.post("/reset-password", authController.postResetPassword);

// reset password with token on param
router.get("/reset-password/:token", authController.getNewPasswordPage);

// reset password to new password
router.post(
  "/new-password",
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password should be atleast 6 characters long."),
  authController.postNewPassword
);

module.exports = router;
