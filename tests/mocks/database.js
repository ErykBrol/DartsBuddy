const mongoose = require('mongoose');
const User = require('../models/User');
const Game = require('../models/Game');

const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();

const userOneGameOneId = new mongoose.Types.ObjectId();
const userTwoGameOneId = new mongoose.Types.ObjectId();

const userOne = {
	_id: userOneId,
	username: 'test1',
	password: '1234',
	createdAt: '2021-06-01T05:19:07.896Z',
};

const userTwo = {
	_id: userTwoId,
	username: 'test2',
	password: '1234',
	createdAt: '2021-06-01T05:19:07.896Z',
};

const userOneGameOne = {
	_id: userOneGameOneId,
	type: 'X01',
	createdAt: '2021-06-01T05:19:07.896Z',
	roomId: 'ABC123',
	startingScore: 501,
	numLegsToWin: 2,
};

const userTwoGameOne = {
	_id: userTwoGameOneId,
	type: 'X01',
	createdAt: '2021-06-01T05:19:07.896Z',
	roomId: 'DEF456',
	startingScore: 301,
	numLegsToWin: 5,
};

const setupDatabase = async () => {
	// Delete any existing entries
	await User.deleteMany({});
	await Game.deleteMany({});

	// Add our newly made entries
	await new User(userOne).save();
	await new User(userTwo).save();
	await new Game(userOneGameOne).save();
	await new Game(userTwoGameOne).save();
};

module.exports = {
	setUpDatabase,
	userOne,
	userTwo,
	userOneId,
	userTwoId,
	userOneGameOneId,
	userTwoGameOneId,
	userOneGameOne,
	userTwoGameOne,
};
