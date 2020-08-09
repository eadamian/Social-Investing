var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.redirect(path.join(__dirname, 'public') + "/login.html");
  res.sendFile(__dirname + '/public/login.html');
});

module.exports = router;
