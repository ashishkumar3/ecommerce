// Models
const User = require("../models/user");

// get users from db
exports.get_all_users = (req, res) => {
  User.find()
    .then(doc => {
      res.status(201).send(doc);
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.get_user_by_id = (req, res) => {
  User.findById(req.user.id, (err, doc) => {
    if (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};
