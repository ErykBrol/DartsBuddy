const request = require('supertest');
const server = require('../index.js');
const { setUpDatabase, userOne } = require('./mocks/database');
const User = require('../models/User');

beforeAll(setUpDatabase);

test('Success on register new user', async () => {
	const username = 'testUser';
	const password = '12345';
	const response = await request(server)
		.post('/users/register')
		.send({
			username,
			password,
		})
		.expect(201);

	// Assert that user was added to database
	const user = await User.findById(response.body.user._id);
	expect(user).not.toBeNull();

	expect(user.credits).toBe(1);
	expect(response.body).toMatchObject({
		user: {
			username,
		},
	});
});
