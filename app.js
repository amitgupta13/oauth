const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
require("./config/passport");
const { mongodb, session } = require("./config/keys");
const app = express();

app.set("view engine", "ejs");

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [session.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(mongodb.dbURI, { useNewUrlParser: true }, () => {
  console.log("Connected To MongoDB");
});

//set up routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
