const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

const dashboardController = require("../controllers/dashboard.controller");

// get the dashboard page
router.get(
  "/dashboard",
  ensureAuthenticated,
  dashboardController.get_dashboard
);

module.exports = router;
