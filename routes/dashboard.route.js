const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/is-auth");

const dashboardController = require("../controllers/dashboard.controller");

// get the dashboard page
router.get("/dashboard", isAuthenticated, dashboardController.get_dashboard);

// get the account page
router.get("/account", isAuthenticated, dashboardController.getAccountPage);

module.exports = router;
