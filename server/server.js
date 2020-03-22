const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const { getSecret } = require('./secrets');
const videosRoute = require('./routes/videos');

mongoose.Promise = global.Promise;
mongoose.connect(getSecret('dbUri')).then(
  () => {
    console.log('Connected to mongoDB');
  },
  (err) => console.log('Error connecting to mongoDB', err)
);

const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 3000;

app.use(function (req, res, next) {
  let allowedOrigins = [
    'http://127.0.0.1:3001',
    'http://localhost:3001',
    'https://sonzera.mus.br',
    'http://sonzera.mus.br',
    'https://www.sonzera.mus.br',
    'http://www.sonzera.mus.br',
    'https://sonzera.netlify.com',
    'http://sonzera.netlify.com',
  ];
  let origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,HEAD,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept, token');
  next();
});

const io = require('socket.io')(server);
io.on('connection', function(socket){
  socket.emit('tickets', { hello: 'world' });
});

app.set('socketio', io);

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/videos', videosRoute);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app };
