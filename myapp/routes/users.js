var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var fname = req.param('fname');
  var lname = req.param('lname');
  res.send('Name:' + fname + ' : ' + lname);
});

router.post('/',function(req,res,next){
    var fname = req.body.fname;
    var lname = req.body.lname;
    res.send('Name:' + fname + ' : ' + lname);
});

module.exports = router;
