const passport = require("passport");
const bcrypt = require("bcryptjs");
// Models
const User = require("../models/user");

// get signup page
exports.get_signup_page = (req, res) => {
  res.render("signup", { title: "signup", path: "/signup" });
};

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

// add a new user to db
exports.add_user = (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  let { name, email, password } = req.body;

  let errors = [];
  // form validations
  if (!name || !email || !password) {
    errors.push({ msg: "Please fill in all the fields" });
    return res
      .status(409)
      .render("signup", { errors: errors, path: "/signup" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be atleast 6 characters" });
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      // req.flash("error_msg", "Email already exists!");
      errors.push({ msg: "Email already exists!" });
      return res
        .status(409)
        .render("signup", { errors: errors, path: "/signup" });
    }

    bcrypt.hash(req.body.password, 13, (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err
        });
      }
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash
      });
      newUser
        .save()
        .then(doc => {
          if (!doc || doc.length === 0) {
            return res.status(500).send(doc);
          }
          req.flash("success_msg", "You are now registered and can log in.");
          res.status(201).redirect("/login");
          console.log(`User added to db: ${doc}`);
        })
        .catch(err => {
          res.status(500).json(err);
          console.log(err);
        });
    });
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
exports.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
};

//login
exports.login_user = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
};

//signup
// exports.signup_user = (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/login",
//     failureRedirect: "/signup",
//     failureFlash: true
//   })(req, res, next);
// };
