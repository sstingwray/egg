var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

var images = {}

fs.readdir('public/images/full', (err, folders) => {
  folders.forEach(folder => {
    images[folder] = [];
    fs.readdir(`public/images/full/${folder}`, (err, files) => {
      files.forEach(file => {
        images[folder].push({
          category: folder,
          file: `${folder}/${file}`,
          text: ''
        });
      });
    });
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET image data. */
router.get('/getImages', function(req, res, next) {
  console.log(images)
  res.status(200).json({data: images});
});

module.exports = router;
