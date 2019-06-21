const User = require("../models/user");

exports.get_dashboard = (req, res) => {
  console.log(req.session);
  res.render("dashboard", {
    pageTitle: "Dashboard",
    path: "/dashboard",
    email: req.session.user.email,
    user: req.user
  });
};

exports.getAccountPage = (req, res, next) => {
  res.render("account", {
    pageTitle: "Account",
    path: "/account",
    email: req.session.user.email,
    user: req.user
  });
};
