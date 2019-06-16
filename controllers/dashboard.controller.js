const User = require("../models/user");

exports.get_dashboard = (req, res) => {
  let username;
  // get the user with the id
  console.log(req.session.isLoggedIn);
  User.findOne({ _id: req.user.id })
    .then(doc => {
      username = doc.name;
      console.log(username);
    })
    .catch(err => {
      throw err;
    });

  res.render("dashboard", {
    title: "Dashboard",
    id: req.user.id,
    path: "/dashboard",
    username: username
  });
};
