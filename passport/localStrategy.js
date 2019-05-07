const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Client          = require('../models/Client');
const bcrypt        = require('bcrypt');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, 
  (email, password, done) => {
    Client.findOne({ email })
    .then(foundClient => {
      if (!foundClient) {
        done(null, false, { message: 'Incorrect email' });
        return;
      }

      if (!bcrypt.compareSync(password, foundClient.password)) {
        done(null, false, { message: 'Incorrect password' });
        return;
      }

      done(null, foundClient);
    })
    .catch(err => done(err));
  }
));
