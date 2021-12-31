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
   var fileLocations = ['./public/settings_1.json','./public/settings_2.json','./public/settings_3.json']
   genMappingColumn(req, res, fileLocations);
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
    var modFileName = file.originalname.replace('.csv', '-mod.csv')
    res.locals.filename = modFileName;
    res.locals.filenames.push(modFileName);
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
    var fileLocation = './public/settings_1.json'
    jsonfile.readFile(fileLocation, function (err, mapping) {
        if (err) console.error(err)
        console.log(mapping)
        doMapping(jsonObj, file, mapping, res)
    });
};

var doMapping = function (jsonObj, file, mapping, res) {
    var fromHeader = mapping.map(x => x.from);
    var toHeader = mapping.map(x => x.to);

    console.log('fromHeader: ' + fromHeader)
    console.log('toHeader: ' + toHeader)

    var result = [];
    for(var i = 0; i<jsonObj.length-1; i++) {
        var item = jsonObj[i];
        var object = {};
        mapping.map(mp => {
            object[mp.to] = item[mp.from]
        })
        result.push(object);
    }

    // jsonObj.forEach(item => {
    //     var object = {};
    //     mapping.map(mp => {
    //         object[mp.to] = item[mp.from]
    //     })
    //     result.push(object);
    // })

    toCsv(result, file, toHeader, res);
};

var toCsv = function (json, file, toHeader, res) {
    console.log("convert to csv from: " + json);
    var writer = jsontocsv.createObjectCsvWriter;
    var headers = [];
    // header format
    // [
    //     {id: 'li', title: 'li'},
    //     {id: 'bank', title: 'bank'}
    // ]
    toHeader.map(x => {
        var object = {
            id: x,
            title: x
        }
        headers.push(object)
    })
    var modFileName = file.originalname.replace('.csv', '-mod.csv')
    var csvWriter = writer({
        path: file.destination + modFileName,
        header: headers
    });

    csvWriter.writeRecords(json).then(() => {
        console.log("job done for " + modFileName);
    })

    res.render('index', { title: 'Patom Converter', login: true, upload: true, download: true });

};

module.exports = router;