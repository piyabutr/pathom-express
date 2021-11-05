var express = require('express');
var router = express.Router();

var multer = require('multer');
var parse = require('csv-parse');

const upload = multer({ dest: './public/data/uploads/' })
router.post('/upload', upload.single('uploaded_file'), function (req, res) {
   // req.file is the name of your file in the form above, here 'uploaded_file'
   // req.body will hold the text fields, if there were any 
   console.log(req.file, req.body);
   res.render("success");
});

module.exports = router;