const express = require("express");
const passport = require('passport');
const router = express.Router();
const Client = require("../models/Client");
const Professional = require("../models/Professional");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, failureDetails) => {
    if(err){
      res.status(500).json({
        message: 'Authentication error',
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
  const {name, email, password, confirmPassword, type} = req.body;
  let salt, hashPass, error = false;

  if(email.trim().length === 0 || password.length === 0 || name.trim().length === 0 || confirmPassword.length === 0 || password !== confirmPassword || !['Client', 'Professional'].includes(type)){
    res.status(400).json({
      message: 'There are errors on the form',
    });
    return;
  }

  Client.findOne({email})
    .then(client => {
      if(client){
        error = true;
        res.status(400).json({
          message: 'Email currently in use'
        });
        return;
      }
      return Promise.resolve();
    })
    .then(()=> Professional.findOne({email}))
    .then(professional => {
      if(professional){
        error = true;
        res.status(400).json({
          message: 'Email currently in use'
        });
        return;
      }
      return Promise.resolve();
    })
    .then(()=>{
      if(!error){
        switch(type){
        case 'Client':
          salt = bcrypt.genSaltSync(10);
          hashPass = bcrypt.hashSync(password, salt);

          const newClient = new Client({
            email,
            password: hashPass,
            name,
          });

          newClient.save()
            .then(client => {
              req.login(newClient, (err) => {
                if(err){
                  res.status(500).json({
                    message: 'The login after signup went bad',
                  });
                  return;
                }
                res.status(200).json({client: newClient});
              });
            })
            .catch(err => {
              res.status(400).json({
                message: 'Client not saved',
              });
            });
        break;
        case 'Professional':
          salt = bcrypt.genSaltSync(10);
          hashPass = bcrypt.hashSync(password, salt);

          const newProfessional = new Professional({
            email,
            password: hashPass,
            name,
          });
          newProfessional.save()
            .then(professional => {
              req.login(newProfessional, (err) => {
                if(err){
                  res.status(500).json({
                    message: 'The login after signup went bad',
                  });
                  return;
                }
                res.status(200).json({professional: newProfessional});
              });
            })
            .catch(err => {
              if(err){
                res.status(400).json({
                  message: 'Professional not saved',
                });
                return;
              }
            });
        break;
        default:
          res.status(500).json({
            message: 'The account type is not valid'
          });
        break;
        }
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err
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
