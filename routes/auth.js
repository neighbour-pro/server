const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

const bcrypt = require("bcryptjs");
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

  if(!name || !email || !password || !confirmPassword || !role ||email.trim().length === 0 
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

router.get("/logged", (req, res) => {
  if(req.isAuthenticated()){
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({
    message: 'Not logged'
  });
});

router.post("/logout", (req, res) => {
  req.logout();
  res.status(200).json({
    message: 'Logged out'
  });
});

router.post('/seed', (req, res, next) => {
  const mongoose = require("mongoose");
  const Review = require("../models/Review");
  const faker = require("faker");

  const testPassword = '1';
  faker.locale = 'es';
  const reviewsStarsOptions = ['1', '2', '3', '4', '5'];
  const clientsToCreate = 30;
  const professionalsToCreate = 30;

  function getRandomCoord(lat, lng, rad){
    var r = rad/111300 // meters
      , y0 = lat
      , x0 = lng
      , u = Math.random()
      , v = Math.random()
      , w = r * Math.sqrt(u)
      , t = 2 * Math.PI * v
      , x = w * Math.cos(t)
      , y1 = w * Math.sin(t)
      , x1 = x / Math.cos(y0);

    newY = y0 + y1;
    newX = x0 + x1;

    return {
      lng: newX,
      lat: newY
    };
  }

  function getRandomIntMinMax(min = 0, max = 10){
    return Math.floor(Math.random() * (max - min) + min);
  }

  mongoose
    .connect(process.env.DB, {useNewUrlParser: true})
    .then(x => {
      console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    })
    .catch(err => {
      console.error('Error connecting to mongo', err)
    });

  const password = bcrypt.hashSync(testPassword, bcrypt.genSaltSync(bcryptSalt));

  const clients = new Array(clientsToCreate).fill(0).map(clients => {
    let response = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      lastSeen: Date.now(),
      role: 'Client',
    };

    if(Math.random() > .4){
      response.phone = faker.phone.phoneNumber('+34#########');
    }

    return response;
  });

  // User.collection.drop()
  // .then(() => Review.collection.drop())
  // .then(() => User.create(clients))
  User.create(clients)
  .then(clients => {
    console.log(`${clients.length} clients created`);
    return Promise.resolve();
  })
  .then(()=>{
    const professionals = new Array(professionalsToCreate).fill(0).map(professional => {
      const reviews = new Array(getRandomIntMinMax(0, 25)).fill(0).map(review => {
        return User.findOne({role: 'Client'}).skip(Math.floor(Math.random() * clientsToCreate))
        .then(user => {
          return Review.create({
            fromUserId: user._id,
            stars: reviewsStarsOptions[Math.floor(Math.random()*reviewsStarsOptions.length)],
            comment: faker.lorem.words(getRandomIntMinMax(15, 130))
          });
        })
        .catch(err => console.error(err));
      });

      return Promise.all(reviews)
        .then(reviewArr => {
          let {lat, lng} = getRandomCoord(40.3925321, -3.6982669, 20000);
          professional = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password,
            lastSeen: Date.now(),
            location: {
              coordinates: [lng, lat]
            },
            reviews: reviewArr,
            description: faker.lorem.words(getRandomIntMinMax(35, 50)),
            services: faker.lorem.words(getRandomIntMinMax(100, 150)),
            role: 'Professional',
          };
          return User.create(professional);
        })
        .catch(err => console.error(err));
    });
    return Promise.all(professionals);
  })
  .then((professionals)=> {
    console.log(`${professionals.length} professionals created`);
    return Promise.resolve();
  })
  .then(() => {
    mongoose.disconnect()
    res.status(200).json({
      message: 'Created professionals and clients'
    });
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
    res.status(200).json({
      message: 'Error',
      error:err
    });
    throw err;
  });
});

module.exports = router;
