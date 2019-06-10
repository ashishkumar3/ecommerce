exports.get_login = (req, res) => {
  res.render("login", { title: "Login" });
};

// login a user
exports.login_user = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication Failed!"
        });
      }

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Authentication Failed!"
          });
        }
        if (result) {
          const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          res.status(200).json({
            message: "Authentication Successful.",
            token: token
          });
        }
        res.status(401).json({
          message: "Authentication Failed!"
        });
      });
    })
    .catch(err => {
      res.status(500).json(err);
    });
};
