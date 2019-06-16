const passport = require("passport");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLoginPage = (req, res) => {
  // check if user is not already logged in. if yes redirect to home else show login page
  // console.log(req.session.isLoggedIn);
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  }
  res.render("auth/login", {
    pageTitle: "Login",
    id: null,
    path: "/login",
    isAuthenticated: req.session.isLoggedIn
  });
};

// get signup page
exports.getSignupPage = (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  }
  res.render("auth/signup", {
    title: "signup",
    path: "/signup",
    isAuthenticated: req.session.isLoggedIn
  });
};

// login a user
exports.postLoginUser = (req, res, next) => {
  let { email, password } = req.body;

  // console.log(req.body);

  let errors = [];
  // form validations
  if (!email || !password) {
    errors.push({ msg: "Please fill in all the fields" });
    return res.status(409).render("auth/login", {
      errors: errors,
      path: "/login",
      isAuthenticated: false
    });
  }
  // console.log(email, password);
  User.findOne({ email: email })
    .then(user => {
      // console.log(user, "usererrrr");
      if (!user) {
        errors.push({ msg: "Authentication Failed!" });
        return res.status(409).render("auth/login", {
          errors: errors,
          path: "/login",
          isAuthenticated: req.session.isLoggedIn
        });
      }

      bcrypt.compare(password, user.password).then(doMatch => {
        if (doMatch) {
          // console.log(doMatch, "match hua kya?");
          // create a session
          req.session.isLoggedIn = true;
          req.session.user = user;
          return res.status(200).redirect("/");
        }
        res.status(409).render("auth/login", {
          errors: errors,
          path: "/login",
          isAuthenticated: false
        });
      });
    })
    .catch(err => {
      res.status(500).send("bhag bc");
    });
};

//login
// exports.login_user = (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true
//   })(req, res, next);
// };

exports.postLogout = (req, res, next) => {
  // clear the session
  // console.log(req.session);
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};
