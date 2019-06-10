const express = require("express");
const router = express.Router();

const dashboardController = require("../controller/dashboard");

// get the dashboard page
router.get("/", dashboardController.get_dashboard);

module.exports = router;
