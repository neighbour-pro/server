require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const session    = require("express-session");
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

require('./models/User');
require('./models/Review');
require('./models/Image');

mongoose
  .connect(process.env.DB, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}));

// Enable authentication using session + passport
app.use(session({
  secret: 'myneighbourappsec',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore( { mongooseConnection: mongoose.connection })
}))
require('./passport')(app);

const auth = require('./routes/auth');
app.use('/api/auth', auth);
const user = require('./routes/user');
app.use('/api/user', user);
const review = require('./routes/review');
app.use('/api/review', review);
      
module.exports = app;