const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const { google } = require("./keys");
const { User } = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      //options for strategy
      callbackURL: "/auth/google/redirect",
      clientID: google.clientID,
      clientSecret: google.clientSecret
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await new User({
          username: profile.displayName,
          googleId: profile.id,
          thumbnail: profile._json.picture
        }).save();
        done(null, user);
      }

      console.log("user is : ", user);
      done(null, user);
    }
  )
);
