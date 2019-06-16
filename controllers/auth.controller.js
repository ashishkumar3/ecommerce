const passport = require("passport");

exports.getLoginPage = (req, res) => {
  // check if user is not already logged in. if yes redirect to home else show login page
  // console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    pageTitle: "Login",
    id: null,
    path: "/login",
    isAuthenticated: req.session.isLoggedIn
  });
};

// get signup page
exports.getSignupPage = (req, res) => {
  res.render("auth/signup", { title: "signup", path: "/signup" });
};

// login a user
// exports.login_user = (req, res) => {
//   User.findOne({ email: req.body.email })
//     .then(user => {
//       if (!user) {
//         return res.status(401).json({
//           message: "Authentication Failed!"
//         });
//       }

//       bcrypt.compare(req.body.password, user.password, (err, result) => {
//         if (err) {
//           return res.status(401).json({
//             message: "Authentication Failed!"
//           });
//         }
//         if (result) {
//           const token = jwt.sign(
//             { email: user.email, id: user._id },
//             process.env.JWT_KEY,
//             {
//               expiresIn: "1h"
//             }
//           );
//           res.status(200).json({
//             message: "Authentication Successful.",
//             token: token
//           });
//         }
//         res.status(401).json({
//           message: "Authentication Failed!"
//         });
//       });
//     })
//     .catch(err => {
//       res.status(500).json(err);
//     });
// };

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
