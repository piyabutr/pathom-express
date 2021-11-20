var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var fname = req.body.fname;
    var lname = req.body.lname;
    if (fname == 'admin' && lname == 'admin') {
      isLoggedIn = true;
      genMappingColumn(res);
    } else {
      res.render('error', { message: 'Permission denied', error: { status: 'Not allowed to access', stack: '' } });
    }
});

router.post('/',function(req,res,next){
    var fname = req.body.fname;
    var lname = req.body.lname;
    if (fname == 'admin' && lname == 'admin') {
      isLoggedIn = true;
      genMappingColumn(res);
    } else {
      res.render('error', { message: 'Permission denied', error: { status: 'Not allowed to access', stack: '' } });
    }
});

var genMappingColumn = function (res) {
    var fileLocation = './public/settings.json'
    jsonfile.readFile(fileLocation, function (err, mapping) {
        if (err) console.error(err)
        console.log(mapping)
        res.locals.mapfrom = mapping.map(x => x.from);
        res.locals.mapto = mapping.map(x => x.to);
        res.render('index', { title: 'Patom Converter', login: isLoggedIn, upload: true, download: false});
    });
}

module.exports = router;
