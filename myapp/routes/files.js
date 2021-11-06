var express = require('express');
var router = express.Router();

var multer = require('multer');
var parse = require('csv-parse');
var csvtojson = require('csvtojson');
var jsontocsv = require('csv-writer');
var jsonfile = require('jsonfile')

var modFileNames = [];
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
   //TODO pass res along the way and do the below statement at the end on other method
   console.log('all files for download:'+ modFileNames);
   res.render('index', { title: 'Pathom Converter', login: true, upload: true, download: true, filename: modFileNames[0] });
});

router.post('/download', function(req, res){
    const file = './public/data/uploads/' + req.filename;
    console.log("download file: " + req.filename);
    res.download(file); // Set disposition and send it.
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
    var modFileName = file.originalname.replace('.csv', '-mod.csv')
    var csvWriter = writer({
        path: file.destination + modFileName,
        header: headers
    });

    csvWriter.writeRecords(json).then(() => {
        modFileNames.push(modFileName)
        console.log("job done for" + modFileName);
    })

};

module.exports = router;