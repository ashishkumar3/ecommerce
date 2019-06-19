// Models
const User = require("../models/user");

// get users from db
exports.get_all_users = (req, res) => {
  User.find()
    .then(doc => {
      res.status(201).send(doc);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.get_user_by_id = (req, res) => {
  User.findById(req.user.id, (err, doc) => {
    if (err) res.status(500).json(err);
    if (doc) {
      return res.status(201).json(doc);
    }
  });
};

exports.update_user = (req, res) => {
  if (!req.query.email) {
    return res.status(400).send("Missing URL parameter: email");
  }
  User.findOneAndUpdate({ email: req.query.email }, req.body, { new: true })
    .then(doc => {
      res.json(doc);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.remove_user_with_id = (req, res) => {
  if (!req.params.userId) {
    return res.status(400).send("Missing URL parameter: id");
  }

  User.findOne({ _id: req.params.userId }).then(user => {
    if (!user) {
      return res.status(409).json({
        message: "Cannot find this user"
      });
    }
    User.findOneAndDelete({ _id: req.params.userId })
      .then(doc => {
        res.status(200).json({
          message: "User deleted"
        });
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
};

// logout
// exports.logout = (req, res) => {
//   req.logout();
//   req.flash("success_msg", "You are logged out");
//   res.redirect("/login");
// };

//login
// exports.login_user = (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true
//   })(req, res, next);
// };

// exports.postLogin = (req, res, next) => {
//   User.findById("5d062b0d4548ce373234f542")
//     .then(user => {
//       req.session.isLoggedIn = true;
//       req.session.user = user;
//       req.session.save(err => {
//         if (err) {
//           console.log(err);
//         }
//         res.redirect("/");
//       });
//     })
//     .catch(err => console.log(err));
// };

//signup
// exports.signup_user = (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/login",
//     failureRedirect: "/signup",
//     failureFlash: true
//   })(req, res, next);
// };
