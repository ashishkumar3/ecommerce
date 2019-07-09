const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// mailing service
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

// form validation
const { validationResult } = require("express-validator/check");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

/*
 ************************RENDERING THE LOGIN PAGE***************************
 */
exports.getLoginPage = (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  }
  res.render("auth/login", {
    pageTitle: "Login",
    id: null,
    path: "/login"
  });
};

/*
 **********************RENDERING THE SIGNUP PAGE***********************
 */
exports.getSignupPage = (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  }
  res.render("auth/signup", {
    pageTitle: "signup",
    path: "/signup",
    oldInputs: {
      email: "",
      name: ""
    }
  });
};

/*
 *********************SIGNING UP A USER***************************
 */
exports.postSignupUser = (req, res) => {
  let { name, email, password } = req.body;

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      errors: errors.array(),
      path: "/signup",
      pageTitle: "Signup",
      oldInputs: {
        email: email,
        name: name
      }
    });
  }

  bcrypt.hash(password, 13, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err
      });
    }
    const newUser = new User({
      name: name,
      email: email,
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
        return transporter.sendMail({
          to: email,
          from: "ashish@shop.com",
          subject: "Signup successful",
          html: "<h1>You signed up successfully</h1>"
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

/*
 *********************LOGGING IN A USER***************************
 */
exports.postLoginUser = (req, res, next) => {
  let { email, password } = req.body;

  let errors = [];
  // form validations
  if (!email || !password) {
    errors.push({ msg: "Please fill in all the fields" });
    return res.status(409).render("auth/login", {
      errors: errors,
      path: "/login"
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        errors.push({ msg: "Authentication Failed!" });
        return res.status(409).render("auth/login", {
          errors: errors,
          path: "/login"
        });
      }

      bcrypt.compare(password, user.password).then(doMatch => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return res.status(200).redirect("/");
        }
        errors.push({ msg: "Email/password incorrect." });
        res.status(409).render("auth/login", {
          errors: errors,
          path: "/login"
        });
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

/*
 ************************WHEN USER CLICKS LOGOUT BUTTON************************
 */

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};

/*
 ************************GET RESET PASSWORD PAGE*************************
 */

exports.getResetPasswordPage = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  }
  res.render("auth/reset-password", {
    pageTitle: "Reset Password",
    path: "/reset-password"
  });
};

/*
 ************************RESET PASSWORD*************************
 */

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/");
    }
    let errors = [];
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          errors.push({ msg: "Email address does not exists." });
          res.render("auth/reset-password", {
            errors: errors,
            path: "/reset-password"
          });
        }

        user.resetPasswordToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // + 1 hr from now
        return user.save();
      })
      .then(result => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "ashish@shop.com",
          subject: "Password reset",
          html: `
            <p>You have password reset</p>
            <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to reset your password</p>
          `
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

/*
 ************************GET NEW PASSWORD PAGE*************************
 */

exports.getNewPasswordPage = (req, res, next) => {
  const token = req.params.token;
  console.log("token", token);
  let errors = [];
  User.findOne({
    resetPasswordToken: token,
    resetTokenExpiration: { $gt: Date.now() }
  })
    .then(user => {
      console.log(user);
      if (!user) {
        res.redirect("/");
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        userId: user._id.toString(),
        resetPasswordToken: user.resetPasswordToken
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

/*
 ************************ADD NEW PASSWORD*************************
 */

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const resetPasswordToken = req.body.resetPasswordToken;
  let resetUser;

  // let errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   console.log(errors.array());
  //   return res.status(422).render("auth/signup", {
  //     errors: errors.array(),
  //     path: "/signup",
  //     pageTitle: "Signup",
  //     oldInputs: {
  //       email: email,
  //       name: name
  //     }
  //   });
  // }

  User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 13);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetPasswordToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      req.flash(
        "success_msg",
        "Your Password has changed and you can log in now."
      );
      res.status(201).redirect("/login");
      console.log(`Password changed for user ${result}`);
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
