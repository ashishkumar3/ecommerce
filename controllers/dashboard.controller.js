const User = require("../models/user");

exports.get_dashboard = (req, res) => {
  console.log(req.session);
  res.render("dashboard", {
    title: "Dashboard",
    path: "/dashboard",
    email: req.session.user.email
  });
};
