var express = require('express');
var router = express.Router();

var isLoggedIn = false;

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('index', { title: 'Patom Converter', login: isLoggedIn, upload: false, download: false, mapping: '' });
});

module.exports = router;
