const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");

const ejslayouts = require("express-ejs-layouts");

const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

// ROUTES
const dashboard = require("./routes/dashboard");
const login = require("./routes/login");
const user = require("./routes/user");

// MONGO
const mongoose = require("mongoose");

// create express app.
const app = express();

// passport config
require("./config/passport")(passport);

// serving static files.
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// express session
app.use(
  session({
    secret: "a4f80asd71f-c87dq3-4447gd-8ed3gbe2",
    resave: true,
    saveUninitialized: true
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

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
app.use(ejslayouts);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// remove caching for back button
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

app.use(morgan("dev"));

app.use(dashboard);
app.use(login);
app.use(user);

// app.get("/random", (req, res) => {
//   res.render("random");
// });

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
