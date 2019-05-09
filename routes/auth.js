const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, failureDetails) => {
    if(err){
      res.status(500).json({
        message: 'Authentication error!',
        error: failureDetails
      });
      return;
    }

    if(!user){
      res.status(401).json({
        error: failureDetails
      });
      return;
    }

    req.login(user, (err) => {
      if(err){
        res.status(500).json({
          message: 'Error on the session',
        });
        return;
      }

      res.status(200).json(user);
    });
  })(req, res, next);
});

router.post("/signup", (req, res, next) => {
  const {name, email, password, confirmPassword, role} = req.body;
  let salt, hashPass;

  if(email.trim().length === 0 
  || password.length === 0 
  || name.trim().length === 0 
  || confirmPassword.length === 0 
  || password !== confirmPassword 
  || !['Client', 'Professional'].includes(role)){
    res.status(400).json({
      code: 400,
      message: 'There are errors on the form'
    });
    return;
  }

  User.findOne({email})
  .then(user => {
    if(user){
      res.status(400).json({
        code: 400,
        message: 'Email currently in use',
      });
      return;
    }

    salt = bcrypt.genSaltSync(bcryptSalt);
    hashPass = bcrypt.hashSync(password, salt);

    User.create({
      email,
      name,
      password: hashPass,
      role,
      lastSeen: Date.now()
    })
    .then(user => {
      req.login(user, err => {
        if(err){
          res.status(500).json({
            code: 500,
            message: 'Error in login after signup',
            error: err
          });
          return;
        }
        res.status(200).json({
          code: 200,
          user
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        code: 500,
        message: 'User not saved',
        error: err
      });
      return;
    });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.json({
    logout: true
  });
});

module.exports = router;
