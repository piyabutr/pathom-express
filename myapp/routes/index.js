var express = require('express');
var router = express.Router();

var isLoggedIn = false;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pathom Converter', login: isLoggedIn });
});

module.exports = router;
