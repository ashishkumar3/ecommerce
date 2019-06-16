const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/is-auth");

const dashboardController = require("../controllers/dashboard.controller");

// get the dashboard page
router.get("/dashboard", isAuthenticated, dashboardController.get_dashboard);

module.exports = router;
