const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/User');
const bcrypt        = require('bcrypt');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, 
  (email, password, done) => {

    // const client = Client.findOne({email});
    // const professional = Professional.findOne({email});
    
    // Promise.all([client, professional])
    //   .then((values) => {
    //     if(values[0]){
    //       if(!bcrypt.compareSync(password, values[0].password)){
    //         done(null, false, {message: 'Incorrect password'});
    //         return;
    //       }
    //       done(null, values[0]);
    //       return;
    //     }

    //     if(values[1]){
    //       if(!bcrypt.compareSync(password, values[1].password)){
    //         done(null, false, {message: 'Incorrect password'});
    //         return;
    //       }
    //       done(null, values[1]);
    //       return;
    //     }

    //     done(null, false, {message: 'User not found'})
    //   })
    //   .catch(err => done(err));
  }
));
