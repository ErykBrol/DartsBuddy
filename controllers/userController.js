const User = require('../models/User');
const bcrypt = require('bcrypt');

let UserController = {
   registerUser: async (req, res) => {
      const userExists = await User.findOne({ username: req.body.username }).catch((err) => {
         return res.status(500).send(err);
      });
      if (userExists) {
         return res.status(501).send({ err: 'A user with this username already exists' });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10).catch((err) => {
         return res.status(500).send({ msg: 'Error creating user', err });
      });

      const user = new User({
         username: req.body.username,
         password: hashedPassword,
         dateJoined: Date(),
      });

      if (req.body.nickname) {
         user.nickname = req.body.nickname;
      }

      try {
         await user.save();
         return res.status(201).send({ msg: 'User succesfully created' });
      } catch (err) {
         return res.status(500).send({ msg: 'Error creating user', err });
      }
   },
   getUser: async (req, res) => {
      const user = await User.findById(req.params.user_id).catch((err) => {
         return res.status(500).send({ msg: 'Error fetching user', err });
      });
      return res.send(user.info);
   },
   deleteUser: async (req, res) => {
      // A user can only delete themselves
      if (req.user._id !== req.params.user_id) {
         return res.status(401).send({ msg: 'Unauthorized to delete this user' });
      }
      await User.findByIdAndDelete(req.params.user_id).catch((err) => {
         return res.status(500).send({ msg: 'Error deleting user', err });
      });
      return res.status(200).send({ msg: 'User successfully deleted' });
   },
   updateUser: async (req, res) => {
      // A user can only update their own profile
      if (req.user._id != req.params.user_id) {
         return res.status(401).send({ msg: 'Unauthorized to modify this user' });
      }
      await User.findByIdAndUpdate(
         req.params.user_id,
         { $set: { nickname: req.body.nickname } },
         { runValidators: true }
      ).catch((err) => {
         return res.status(500).send({ msg: 'Error updating user', err });
      });
      return res.status(200).send({ msg: 'User successfully updated' });
   },
   getStats: async (req, res) => {
      const user = await User.findById(req.params.user_id).catch((err) => {
         return res.status(500).send({ msg: 'Error fetching user', err });
      });
      return res.send(user.stats);
   },
};

module.exports = UserController;
