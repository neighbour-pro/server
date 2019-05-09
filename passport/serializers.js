const passport = require('passport');
const User = require('../models/User');

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession)
  .then(userDocument => {
    userDocument.lastSeen = Date.now();
    cb(null, userDocument);
  })
  .catch(err => {
    cb(err);
  })
});
