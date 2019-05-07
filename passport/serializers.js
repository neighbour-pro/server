const passport = require('passport');
const Client = require('../models/Client');

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  Client.findById(userIdFromSession)
  .then(userDocument => {
    cb(null, userDocument);
  })
  .catch(err => {
    cb(err);
  })
});
