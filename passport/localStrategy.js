const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Client          = require('../models/Client');
const Professional          = require('../models/Professional');
const bcrypt        = require('bcrypt');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, 
  (email, password, done) => {

    Client.findOne({email})
      .then(client => {
        if(client){
          if(!bcrypt.compareSync(password, client.password)){
            done(null, false, {message: 'Incorrect password'});
            return;
          }
          done(null, client);
        }else{
          Professional.findOne({email})
            .then(professional => {
              if(!bcrypt.compareSync(password, client.password)){
              done(null, false, {message: 'Incorrect password'});
              return;
            }
            done(null, client);
            })
            .catch(err => done(err));
        }
      })
      .catch(err => done(err));
  }
));
