const express = require("express");
const router = express.Router();

const userController = require("../controller/user.controller");

// get the signup page
router.get("/signup", userController.get_signup_page);

router.get("/users", userController.get_all_users);

router.get("/get_user_by_id", userController.get_user_by_id);

router.get("/logout", userController.logout);

// create a new user account
router.post("/add-user", userController.add_user);

// login a user
router.post("/login-user", userController.login_user);

// PUT - update a specific learner's info by passing learner's email in the url.
router.put("/user", userController.update_user);

// DELETE - to remove a learner from the db by passing email to the url.
// router.delete("/user/remove/:userId", signupController.remove_user_with_id);

module.exports = router;
