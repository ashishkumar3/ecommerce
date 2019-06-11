const express = require("express");
const router = express.Router();

const signupController = require("../controller/signup");

// get the signup page
router.get("/signup", signupController.get_signup);

router.get("/users", signupController.get_users);

router.get("/logout", signupController.logout);

// create a new user account
router.post("/add-user", signupController.add_user);

// logging in a valid learner if its email and password are valid
// router.post("/user/login", learnerController.login_learner);

// PUT - update a specific learner's info by passing learner's email in the url.
router.put("/user", signupController.update_user);

// DELETE - to remove a learner from the db by passing email to the url.
// router.delete("/user/remove/:userId", signupController.remove_user_with_id);

module.exports = router;
