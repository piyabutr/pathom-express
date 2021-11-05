var express = require('express');
var router = express.Router();

var multer = require('multer');
var parse = require('csv-parse');
var csvtojson = require('csvtojson');
var jsontocsv = require('csv-writer');
var jsonfile = require('jsonfile')

const upload = multer({ dest: './public/data/uploads/' })

router.post('/upload', upload.single('uploaded_file'), function (req, res) {
   console.log(req.file, req.body);
   toJson(req.file);
   res.write("success");
});

router.post('/multiupload', upload.array('uploaded_file'), function (req, res) {
   console.log(req.file, req.body);
   req.files.map(eachFile => {
    toJson(eachFile);
   })
   res.write("success");
});

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

var toJson = function (file) {
    console.log("convert from this file: " + file.path);
    csvtojson().fromFile(file.path).then((jsonObj)=>{
        console.log(jsonObj);
        readSetting(jsonObj, file);
    });
};

var readSetting = function (jsonObj, file) {
    var fileLocation = './public/settings.json'
    jsonfile.readFile(fileLocation, function (err, mapping) {
        if (err) console.error(err)
        console.log(mapping)
        doMapping(jsonObj, file, mapping)
    });
};

var doMapping = function (jsonObj, file, mapping) {
    var fromHeader = mapping.map(x => x.from);
    var toHeader = mapping.map(x => x.to);

    console.log('fromHeader: ' + fromHeader)
    console.log('toHeader: ' + toHeader)

    var result = [];
    jsonObj.forEach(item => {
        var object = {};
        mapping.map(mp => {
            object[mp.to] = item[mp.from]
        })
        result.push(object);
    })

    toCsv(result, file, toHeader);
};

var toCsv = function (json, file, toHeader) {
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
    var csvWriter = writer({
        path: file.destination + file.originalname.replace('.csv', '-mod.csv'),
        header: headers
    });

    csvWriter.writeRecords(json).then(() => {
        console.log("job done");
    })
};

module.exports = router;