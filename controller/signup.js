const bcrypt = require("bcryptjs");
// Models
const User = require("../models/user");

// get signup page
exports.get_signup = (req, res) => {
  res.render("signup", { title: "signup" });
};

// add a new user to db
exports.add_user = (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(409).json({
        message: "Email already exists!"
      });
    }

    bcrypt.hash(req.body.password, 13, (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err
        });
      }
      const newUser = new User({
        email: req.body.email,
        password: hash
      });
      newUser
        .save()
        .then(doc => {
          if (!doc || doc.length === 0) {
            return res.status(500).send(doc);
          }
          res.status(201).send(doc);
          console.log(`User added to db: ${doc}`);
        })
        .catch(err => {
          res.status(500).json(err);
        });
    });
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
