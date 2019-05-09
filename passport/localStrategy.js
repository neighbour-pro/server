const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/User');
const bcrypt        = require('bcrypt');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, 
  (email, password, done) => {
    User.findOne({email})
      .then(user => {
        if(user){
          if(!bcrypt.compareSync(password, user.password)){
            done(null, false, {message: 'Incorrect Password'});
            return;
          }
          done(null, user);
          return;
        }
        done(null, false, {message: 'User not found'});
      })
      .catch(err => done(err));
  }
));
