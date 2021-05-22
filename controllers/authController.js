const passport = require('passport');

let AuthController = {
   login: async (req, res, next) => {
      passport.authenticate('local', function (err, user, info) {
         if (err || !user) {
            return res.status(400).send({ msg: "User doesn't exist." });
         }

         req.logIn(user, function (err) {
            if (err) {
               return res.status(400).send({ msg: 'Error logging in' });
            }
            return res.status(200).send(user.info);
         });
      })(req, res, next);
   },
   logout: async (req, res) => {
      req.logOut();
      res.redirect('/');
   },
   currentUser: async (req, res) => {
      res.send(req.user);
   },
};

module.exports = AuthController;
