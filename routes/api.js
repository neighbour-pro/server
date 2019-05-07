const express = require("express");
const passport = require('passport');
const router = express.Router();
const Client = require("../models/Client");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.post("/signup", (req, res, next) => {
  const {name, email, password, confirmPassword, type, phone} = req.body;

  if(email.trim().length === 0 || password.length === 0 || name.trim().length === 0 || confirmPassword.length === 0 || password !== confirmPassword || !['Client', 'Professional'].includes(type) || phone.trim().length === 0){
    res.status(400).json({
      message: 'There are errors on the form',
    });
    return;
  }

  switch(type){
    case 'Client':
      Client.findOne({email})
        .then(client => {
          if(client){
            res.status(400).json({
              message: 'Email currently in use'
            });
            return;
          }

          const salt = bcrypt.genSaltSync(10);
          const hashPass = bcrypt.hashSync(password, salt);

          const newClient = new Client({
            email,
            password: hashPass,
            name,
            phone
          });
          newClient.save(err => {
            if(err){
              res.status(400).json({
                message: 'Client not saved',
              });
              return;
            }

            req.login(newClient, (err) => {
              res.status(500).json({
                message: 'The login after signup went bad',
              });
              return;
            });

            res.status(200).json(client: newClient);
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
          return;
        });
    break;
    case 'Professional':
      Professional.findOne({email})
        .then(professional => {
          if(professional){
            res.status(400).json({
              message: 'Email currently in use'
            });
            return;
          }

          const salt = bcrypt.genSaltSync(10);
          const hashPass = bcrypt.hashSync(password, salt);

          const newProfessional = new Professional({
            email,
            password: hashPass,
            name,
            phone
          });
          newProfessional.save(err => {
            if(err){
              res.status(400).json({
                message: 'Professional not saved',
              });
              return;
            }

            req.login(newProfessional, (err) => {
              res.status(500).json({
                message: 'The login after signup went bad',
              });
              return;
            });

            res.status(200).json(professional: newProfessional);
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
          return;
        });
    break;
    default:
      res.status(500).json({
        message: 'There have been an error on the server'
      });
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.json({
    logout: true
  });
});

module.exports = router;
