var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pathom Converter', loginstyle: 'visibility:hidden;' });
});

router.post('/upload',function(req,res,next){
    var fname = req.body.fname;
    var lname = req.body.lname;
    if (fname == 'admin' && lname == 'admin') {
      res.render('index', { title: 'Pathom Converter', loginstyle: 'visibility:hidden;' });
    } else {
      res.render('error', { message: 'Permission denied', error: { status: 'Not allowed to access', stack: '' } });
    }
});

module.exports = router;
