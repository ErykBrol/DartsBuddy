const User = require('../models/User');
const bcrypt = require('bcrypt');

let UserController = {
   registerUser: async (req, res) => {
      const { username, password, nickname } = req.body;

      missing_body_params = [];
      if (!username) {
         missing_body_params.append('username')
      }
      if (!password) {
         missing_body_params.append('password')
      }
      if (missing_body_params.length) {
         return res.status(400).send({ msg: `Missing ${missing_body_params.join(', ')} on request body` });
      }

      try {
         if (await User.findOne({ username })) {
            return res.status(501).send({ err: 'A user with this username already exists' });
         }

         const hashedPassword = await bcrypt.hash(password, 10)

         const user = new User({
            username,
            password: hashedPassword, 
            nickname,
         });

         await user.save();
         return res.status(201).send({ msg: 'User succesfully created' });
      } catch (err) {
         console.error(err);
         return res.status(500).send({ msg: 'An unknown error occurred.', err });
      }
   },
   getUser: async (req, res) => {
      const { user_id } = req.params
      if (!user_id) {
         return res.status(400).send({ msg: 'Missing user_id request parameter' });
      }

      try {
         const user = await User.findById(user_id);
         if (!user) {
            return res.status(404).send({ msg: 'User not found' });
         }
         return res.status(200).send(user.info);
      } catch (err) {
         console.error(err);
         return res.status(500).send({ msg: 'An unknown error occurred.', err });
      }
   },
   deleteUser: async (req, res) => {
      const current_user_id = req.user._id;
      const { user_id } = req.params;

      if (!user_id) {
         return res.status(400).send({ msg: 'Missing user_id request parameter' });
      }

      // A user can only delete themselves
      if (req.user._id != req.params.user_id) {
         return res.status(401).send({ msg: 'Unauthorized to delete this user' });
      }

      try {
         const user = await User.findByIdAndDelete(user_id)
         if (!user) {
            return res.status(404).send({ msg: 'User not found' });
         }
         return res.status(200).send({ msg: 'User successfully deleted' });
      } catch (err) {
         console.error(err);
         return res.status(500).send({ msg: 'An unknown error occurred.', err });
      }
   },
   updateUser: async (req, res) => {
      const current_user_id = req.user._id;
      const { user_id } = req.params;
      const { nickname } = req.body;

      if (!user_id) {
         return res.status(400).send({ msg: 'Missing user_id request parameter' });
      }

      // A user can only update themselves
      if (req.user._id != req.params.user_id) {
         return res.status(401).send({ msg: 'Unauthorized to update this user' });
      }

      try {
         const user = await User.findByIdAndUpdate(
            user_id,
            { $set: { nickname } },
            { runValidators: true }
         )
         if (!user) {
            return res.status(404).send({ msg: 'User not found' });
         }
         return res.status(200).send({ msg: 'User successfully updated' });
      } catch (err) {
         console.error(err);
         return res.status(500).send({ msg: 'An unknown error occurred.', err });
      }
   },
   getStats: async (req, res) => {
      const { user_id } = req.params;

      if (!user_id) {
         return res.status(400).send({ msg: 'Missing user_id request parameter' });
      }

      try {
         const user = await User.findByIdAndDelete(user_id)
         if (!user) {
            return res.status(404).send({ msg: 'User not found' });
         }
         return res.status(200).send(user.stats);
      } catch (err) {
         console.error(err);
         return res.status(500).send({ msg: 'An unknown error occurred.', err });
      }

   },
};

module.exports = UserController;
