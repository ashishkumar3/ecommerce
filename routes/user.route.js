const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const isAuthenticated = require("../middleware/is-auth");
// const authController = require("../controllers/auth.controller");

// router.post("/signup-user", userController.signup_user);

// router.get("/users", userController.get_all_users);

router.get("/get_user_by_id", userController.get_user_by_id);

// router.get("/logout", userController.logout);

// login a user
// router.post("/login-user", authController.postLoginUser);

// PUT - update a specific learner's info by passing learner's email in the url.
router.put("/user", isAuthenticated, userController.update_user);

// DELETE - to remove a learner from the db by passing email to the url.
// router.delete("/user/remove/:userId", signupController.remove_user_with_id);

module.exports = router;
