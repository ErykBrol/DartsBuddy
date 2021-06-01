# DartsBuddy
A darts scoring web app for playing real-time, online matches against your friends.

After creating a free account, you can create a game which will spit out a room code for you to join. Simply join this room and pass the code to your friend, and you're in!
Currently only X01 is implemented, with more games on the way soon!

## Built With

-  [React](https://reactjs.org/) - Framework used to design the front-end UI
-  [Express](https://expressjs.com/) - Back-end web application framework
-  [MongoDB](https://www.mongodb.com/) - Database used to store required data
-  [Node.js](https://nodejs.org/) - JavaScript run-time environment
-  [Socket.IO](https://socket.io/) - Enables real-time, bidirectional and event-based communication

## Development

### Prerequisites

To run this application, you'll need:

-  Node.js & npm installed
-  A local installation of [MongoDB](https://www.mongodb.com/try/download/community?tck=docs_server):

   > ### Note
   >
   > If you have brew, install MongoDB with the following steps:
   >
   > -  `brew tap mongodb/brew` to add tap
   > -  `brew install mongodb-community` to install MongoDB
   > -  `brew services start mongodb-community` to start the MongoDB service (stop it with `brew services stop mongodb-community`)

The MongoDB URI, CookieKey, and Port keys can be added in a dev.js file in the ./config directory, see ./config/prod.js for an example of how to do this.
There is a sample dev.js file provided, feel free to change the values in there to your liking.

> ### Note
>
> If you're using a local install of MongoDB then you can set the MONGO URI key to something like `mongodb://localhost/my_database`. You do **NOT** need a MongoDB account to use this local method.

### Getting Started

To get the frontend and backend run locally:

-  Clone this repo
-  Modify ./config/dev.js if desired (see Prerequisites for details)
-  `npm install` to install all back-end required dependencies
-  `cd client` to navigate to front-end directory
-  `npm install` to install all front-end required dependencies
-  `cd ..` to return back to the root directory
-  `npm run dev` to start the local server

The front-end will run on port 3000 to prevent conflicts with the backend Express server which runs on port 5000 (customizable using the PORT environment variable).

### Testing

To run the suite of Postman tests, download the .json file from inside the `/tests` directory and import into your Postman client 

❗ Currently only Postman testing is complete for all API routes. These are being moved to unit tests. Socket testing is being investigated.

## Accessing the database API

The application provides an API in order to easily access some of the information stored on the database. The following endpoints are currently implemented:

Authentication Routes:

-  `POST /auth/login` - sign in using username + password to an existing account
-  `GET /auth/logout` - sign out of the currently signed in account
-  `GET /auth/current_user` - get some basic info about currently signed in user (if any)

Game Routes:

-  `GET /games?type_id=X01&?user_id=123` - Get public games (limited to at most 20 per query), if type_id is passed
-  `GET /games/:game_id` - Get the game with this id
-  `POST /games/:type` - Create a game of this type, requires a gameConfig object to init the game with
-  `DEL /games/:game_id` - Delete the game with this id

User Routes:

-  `POST /users/register` - Register for a new account with this username + password
-  `GET /users/:user_id` - Get user info of the specified user
-  `DEL /users/:user_id` - Delete the specified user
-  `PATCH /users/:user_id` - Update profile info of the specified user
-  `GET /users/:user_id/stats` - Get the profile statistics of this user

## Contributing

1. Fork it (<https://github.com/ErykBrol/DartsBuddy/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## Authors

-  **Eryk Brol** - _Project Developer_ - [ErykBrol](https://github.com/ErykBrol)
