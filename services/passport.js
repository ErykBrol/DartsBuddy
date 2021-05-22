const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/User');

passport.serializeUser((user, done) => {
   done(null, user._id);
});

passport.deserializeUser((id, done) => {
   User.findById(id, (err, user) => {
      done(err, user);
   });
});

async function verifyPassword(passwordPlainText, passwordHashed) {
   return await bcrypt.compare(passwordPlainText, passwordHashed);
}

passport.use(
   new LocalStrategy(function (username, password, done) {
      User.findOne({ username: username }, async function (err, user) {
         if (err) {
            return done(err);
         }
         if (!user) {
            return done("User doesn't exist", false);
         }
         if (!(await verifyPassword(password, user.password))) {
            return done('Incorrect password', false);
         }

         return done(null, user);
      });
   })
);
