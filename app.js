const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");

// ROUTES
const dashboard = require("./routes/dashboard");
const login = require("./routes/login");
const signup = require("./routes/signup");

// MONGO
const mongoose = require("mongoose");

// BCRYPT for password hashing.
const bcrypt = require("bcryptjs");

// create express app.
const app = express();

// serving static files.
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());

// managing CORS errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// set the view engine to ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morgan("dev"));

app.use(dashboard);
app.use(login);
app.use(signup);

// error 404 not found
app.use((req, res, next) => {
  res.status(404).send("pages/404");
});

// error 500 internal server error
app.use((err, req, res, next) => {
  console.error(err);
  res.send("pages/500");
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-av2gk.mongodb.net/${
      process.env.MONGO_DB
    }?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch(err => {
    console.log(err);
  });
