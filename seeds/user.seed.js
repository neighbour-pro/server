require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Review = require("../models/Review");
const faker = require("faker");

const bcryptSalt = 10;
const testPassword = '1';
faker.locale = 'es';
const reviewsStarsOptions = ['1', '2', '3', '4', '5'];

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

const clients = new Array(150).fill(0).map(user => {
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

const professionals = new Array(80).fill(0).map(user => {
  return User.countDocuments({role: 'Client'})
  .then(total => Promise.resolve(new Array(getRandomIntMinMax(0, 25)).fill(total)))
  .then(reviewsArray => reviewsArray.map(totalUsers => User.findOne().skip(Math.floor(Math.random() * totalUsers))
  .then(user => new Review({
      fromUserId: user._id,
      stars: reviewsStarsOptions[Math.floor(Math.random()*reviewsStarsOptions.length)],
      comment: faker.lorem.words(getRandomIntMinMax(15, 130))
  }).save())))
  .then(reviews => Promise.all(reviews))
  .then(resolvedReviews => {
    let {lat, lng} = getRandomCoord(40.504718, -3.697439, 20000);
    let response = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      lastSeen: Date.now(),
      location: {
        coordinates: [lng, lat]
      },
      reviews: [...resolvedReviews],
      description: faker.lorem.words(getRandomIntMinMax(35, 50)),
      services: faker.lorem.words(getRandomIntMinMax(100, 150)),
      role: 'Professional',
    };
  
    if(Math.random() > .2){
      response.phone = faker.phone.phoneNumber('+34#########');
    }
  
    return response;
  })
  .catch(err => console.error(err))
});

User.collection.drop()
.then(() => User.create(clients))
.then(clients => {
  console.log(`${clients.length} clients created`);
  return Promise.resolve();
})
.then(()=> Promise.all(professionals))
.then(professionals => User.create(professionals))
.then((professionals)=> {
  console.log(`${professionals.length} professionals created`);
  return Promise.resolve();
})
.then(() => {
  mongoose.disconnect()
})
.catch(err => {
  console.error(err);
  mongoose.disconnect();
  throw err;
});