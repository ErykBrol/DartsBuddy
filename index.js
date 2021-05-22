const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');

/* Import config */
const keys = require('./config/keys');

/* Import routes */
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');

/* Middleware */
app.use(express.json());

/* Route middleware */
app.use('/auth', authRoutes);
app.use('/users', authRoutes);
app.use('/games', authRoutes);

/* Production logic for serving content (future React frontend) */
if (process.env.NODE_ENV === 'production') {
   app.use(express.static('client/build'));

   // If unknown route, serve index.html
   app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
   });
}

server.listen(keys.port);
