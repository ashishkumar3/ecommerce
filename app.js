const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");

const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

// ROUTES
const dashboardRoutes = require("./routes/dashboard.route");
const loginRoutes = require("./routes/login.route");
const userRoutes = require("./routes/user.route");
const adminRoutes = require("./routes/admin.route");
const shopRoutes = require("./routes/shop.route");

// CONTROLLERS
const errorController = require("./controllers/error.controller");

// MONGO
const mongoose = require("mongoose");

// create express app.
const app = express();
const PORT = process.env.PORT || 3000;

// passport config
require("./config/passport")(passport);

// serving static files.
app.use(express.static(path.join(__dirname, "public")));
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

app.use(dashboardRoutes);
app.use(loginRoutes);
app.use(userRoutes);
app.use("/admin", adminRoutes);
app.use(shopRoutes);

// app.get("/random", (req, res) => {
//   res.render("random");
// });

app.get("/pricing", (req, res) => {
  // process.exit();
  res.render("pricing");
});

// error 404 not found
app.use(errorController.get404);

// error 500 internal server error
// app.use(errorController.get500);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-av2gk.mongodb.net/${
      process.env.MONGO_DB
    }?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch(err => {
    console.log(err);
  });
