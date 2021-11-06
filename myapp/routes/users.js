var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var fname = req.body.fname;
    var lname = req.body.lname;
    if (fname == 'admin' && lname == 'admin') {
      isLoggedIn = true;
      res.render('index', { title: 'Pathom Converter', login: isLoggedIn, upload: true, download: false});
    } else {
      res.render('error', { message: 'Permission denied', error: { status: 'Not allowed to access', stack: '' } });
    }
});

router.post('/',function(req,res,next){
    var fname = req.body.fname;
    var lname = req.body.lname;
    if (fname == 'admin' && lname == 'admin') {
      isLoggedIn = true;
      res.render('index', { title: 'Pathom Converter', login: isLoggedIn, upload: true, download: false});
    } else {
      res.render('error', { message: 'Permission denied', error: { status: 'Not allowed to access', stack: '' } });
    }
});

module.exports = router;
