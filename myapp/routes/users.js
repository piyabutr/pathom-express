var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var fname = req.body.fname;
    var lname = req.body.lname;
    if (fname == 'admin' && lname == 'admin') {
      isLoggedIn = true;
      var fileLocations = ['./public/settings_1.json','./public/settings_2.json','./public/settings_3.json']
      genMappingColumn(res, fileLocations);
    } else {
      res.render('error', { message: 'Permission denied', error: { status: 'Not allowed to access', stack: '' } });
    }
});

router.post('/',function(req,res,next){
    var fname = req.body.fname;
    var lname = req.body.lname;
    if (fname == 'admin' && lname == 'admin') {
      isLoggedIn = true;
      useSingleMapping(res);
    } else {
      res.render('error', { message: 'Permission denied', error: { status: 'Not allowed to access', stack: '' } });
    }
});

var useSingleMapping = function (res) {
    var fileLocation = './public/settings.json';
    res.locals.mapfrom = [];
    res.locals.mapto = [];
    res.locals.naming = [];
    
    jsonfile.readFile(fileLocation, function (err, mapping, i) {
      if (err) console.error(err)
      console.log(mapping)
      
      res.locals.naming.push(mapping["one"]["name"]);
      res.locals.mapfrom.push(mapping["one"]["mapping"].map(x => x.from));
      res.locals.mapto.push(mapping["one"]["mapping"].map(x => x.to));

      res.locals.naming.push(mapping["two"]["name"]);
      res.locals.mapfrom.push(mapping["two"]["mapping"].map(x => x.from));
      res.locals.mapto.push(mapping["two"]["mapping"].map(x => x.to));

      res.locals.naming.push(mapping["three"]["name"]);
      res.locals.mapfrom.push(mapping["three"]["mapping"].map(x => x.from));
      res.locals.mapto.push(mapping["three"]["mapping"].map(x => x.to));
  
      genMappingColumnCompleted(res);
    });
    
}

var genMappingColumn = function (res, fileLocations) {
    res.locals.mapfrom = [];
    res.locals.mapto = [];
    var counter = 0;
    for (var i = 0; i < fileLocations.length; i++) {
      jsonfile.readFile(fileLocations[i], function (err, mapping, i) {
        if (err) console.error(err)
        console.log(mapping)
        res.locals.mapfrom.push(mapping.map(x => x.from));
        res.locals.mapto.push(mapping.map(x => x.to));
        counter ++;
        if (counter === fileLocations.length) genMappingColumnCompleted(res);
      });
    }
}

var genMappingColumnCompleted = function (res) {
    res.render('index', { title: 'Patom Converter', login: isLoggedIn, upload: true, download: false});
}

module.exports = router;
