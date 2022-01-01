var express = require('express');
var router = express.Router();

var multer = require('multer');
var parse = require('csv-parse');
var csvtojson = require('csvtojson');
var jsontocsv = require('csv-writer');
var jsonfile = require('jsonfile');

const upload = multer({ dest: './public/data/uploads/' })

router.post('/multiupload', upload.array('uploaded_file'), function (req, res) {
   res.locals.filenames = [];
   processing(req, res)
   //TODO pass res along the way and do the below statement at the end on other method
});

router.post('/download', function(req, res, next){
    const file = './public/data/uploads/' + req.body.filename;
    console.log("download file: "+ req.body.filename);
    res.download(file); // Set disposition and send it.
});

var processing = function (req, res) {
   console.log(req.file, req.body);
   useSingleMapping(req, res)
}


var useSingleMapping = function (req, res) {
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
  
      genMappingColumnCompleted(req, res);
    });  
}

var genMappingColumn = function (req, res, fileLocations) {
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
        if (counter === fileLocations.length) genMappingColumnCompleted(req, res);
      });
    }
}

var genMappingColumnCompleted = function (req, res) {
   req.files.map(eachFile => {
        toJson(eachFile, res);
        genDownloadFilename(eachFile, res);
   })
}

var genDownloadFilename = function (file, res) {
    for (var i = 0; i < res.locals.naming.length; i++) {
        var modExt = '-' + res.locals.naming[i] + '-mod.csv';
        var modFileName = file.originalname.replace('.csv', modExt)
        res.locals.filenames.push(modFileName);
    }
}

// {
//   fieldname: 'uploaded_file',
//   originalname: 'wongnai-yyyymmdd.csv',
//   encoding: '7bit',
//   mimetype: 'application/vnd.ms-excel',
//   destination: './public/data/uploads/',
//   filename: '2c2fa58ac44db8ef0eaad8cf1aed9dd3',
//   path: 'public\\data\\uploads\\2c2fa58ac44db8ef0eaad8cf1aed9dd3',
//   size: 102
// }

var toJson = function (file, res) {
    console.log("convert from this file: " + file.path);
    csvtojson().fromFile(file.path).then((jsonObj)=>{
        console.log(jsonObj);
        readSetting(jsonObj, file, res);
    });
};

var readSetting = function (jsonObj, file, res) {
    var fileLocation = './public/settings.json'
    jsonfile.readFile(fileLocation, function (err, mapping) {
        if (err) console.error(err)
        console.log(mapping)
        doMapping(jsonObj, file, mapping, res)
    });
};

var doMapping = function (jsonObj, file, mapping, res) {

    var fileLocation = './public/settings.json';
    var mapfrom = [];
    var mapto = [];
    var naming = [];
    var maps = [];
    var results = [];
    var fileNames = [];

    jsonfile.readFile(fileLocation, function (err, mapping, i) {
      if (err) console.error(err)
      console.log(mapping)
      naming.push(mapping["one"]["name"]);
      mapfrom.push(mapping["one"]["mapping"].map(x => x.from));
      mapto.push(mapping["one"]["mapping"].map(x => x.to));
      maps.push(mapping["one"]["mapping"]);

      naming.push(mapping["two"]["name"]);
      mapfrom.push(mapping["two"]["mapping"].map(x => x.from));
      mapto.push(mapping["two"]["mapping"].map(x => x.to));
      maps.push(mapping["two"]["mapping"]);

      naming.push(mapping["three"]["name"]);
      mapfrom.push(mapping["three"]["mapping"].map(x => x.from));
      mapto.push(mapping["three"]["mapping"].map(x => x.to));
      maps.push(mapping["three"]["mapping"]);


      for(var i = 0; i<naming.length-1; i++) {
        var fromHeader = mapfrom[i];
        var toHeader = mapto[i];
        console.log('fromHeader: ' + fromHeader)
        console.log('toHeader: ' + toHeader)

        for(var j = 0; j<jsonObj.length-1; j++) {
            var item = jsonObj[j];
            var object = {};
            maps[i].map(mp => {
                object[mp.to] = item[mp.from]
            })
        }
        results.push(object);
      }

      for (var i = 0; i < naming.length; i++) {
        var modExt = '-' + naming[i] + '-mod.csv';
        var modFileName = file.originalname.replace('.csv', modExt)
        fileNames.push(modFileName);
      }

      toCsv(results, fileNames, file, mapto, res);

    });  
};

var toCsv = function (json, fileNames, file, toHeaders, res) {
    var writer = jsontocsv.createObjectCsvWriter;
    
    for (var i = 0; i < fileNames.length; i++) {
        console.log("convert to csv from: " + json[i]);
        var headers = [];
        // header format
        // [
        //     {id: 'li', title: 'li'},
        //     {id: 'bank', title: 'bank'}
        // ]
        toHeaders[i].map(x => {
            var object = {
                id: x,
                title: x
            }
            headers.push(object)
        })
        var modFileName = fileNames[i];
        var csvWriter = writer({
            path: file.destination + modFileName,
            header: headers
        });

        csvWriter.writeRecords(json).then(() => {
            console.log("job done for " + modFileName);
        })

        if (i === fileNames.length-1) {
            res.render('index', { title: 'Patom Converter', login: true, upload: true, download: true });
        }
    }
};

module.exports = router;