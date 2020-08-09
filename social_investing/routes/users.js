var express = require('express');
//var admin = require('firebase-admin');
var router = express.Router();

//var serviceAccount = require('../productreviews-76b2e-firebase-adminsdk-m99oq-1132b2d336.json');

const firebase = require("firebase");

var db = firebase.firestore();
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://productreviews-76b2e.firebaseio.com'
// });


//Email format must be correct. Password must be 6 letters minimum.
router.post('/createUser', function (req, res, next) {
  //Will need to add friends subcollection later
  console.log("Entered");

  var userEmail = req.body.email;
  var password = req.body.psswd;

  var userObj = {
    email: userEmail,
    username: req.body.userName,
    portfolioId: ''
  };

  firebase.auth().createUserWithEmailAndPassword(userEmail, password).then(
    db.collection("users").add(userObj).then((res) => {
      console.log("user created");
    })).catch((error) => {
    console.log("Failed to create user");
  });
});

router.post('/addFriend', function (req, res, next){
  var friendName = req.body.name;
  var friendId = req.body.id;
  var curUserId = req.body.userId;

  var friendObj = {
    name: friendName,
    userId: friendId
  };
  db.collection("users").doc(curUserId).collection("friends").add(friendObj).then((res) => {
    console.log("friend added");
  }).catch((error) => {
    console.log("Failed to add friend");
  });
});

router.post('/logout', function (req, res, next) {
  firebase.auth().signOut().then(function () {
    console.log("Sign Out successful");
  }).catch(function (error) {
    console.log("Sign Out Error");
  });
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/userLogin', function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
    console.log("Success");
    res.send("200");
  }).catch((error) => {
    console.log("Failed to Login");
  });
});

module.exports = router;