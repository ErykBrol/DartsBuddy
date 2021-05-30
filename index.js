const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cookieSession = require('cookie-session');
const passport = require('passport');
const path = require('path');
const mongoose = require('mongoose');

/* Import configs */
const keys = require('./config/keys');
require('./services/passport');

/* Connect to socket manager */
require('./sockets/socketService')(server);

/* Connect to DB */
mongoose.connect(keys.mongoURI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
   useCreateIndex: true,
});

/* Import routes */
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');

/* Middleware */
app.use(express.json());
app.use(
   cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [keys.cookieKey],
   })
);
app.use(passport.initialize());
app.use(passport.session());

/* Route middleware */
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/games', gameRoutes);

/* Production logic for serving content (future React frontend) */
if (process.env.NODE_ENV === 'production') {
   app.use(express.static('client/build'));

   // If unknown route, serve index.html
   // app.get('*', (req, res) => {
   //    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
   // });
}

app.get('/', (req, res) => {
   res.sendFile('E:\\git_workspace\\DartsBuddy\\DartsBuddy\\client\\index.html');
});

server.listen(keys.port);
