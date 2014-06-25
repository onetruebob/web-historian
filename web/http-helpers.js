var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset) {
  var assetPath = archive.paths.siteAssets + asset;

  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  fs.readFile(assetPath, function(error, data){
    if (error){
      // 404 not found helper
      notFoundHelper(res);
    }
    res.writeHead(200, headers);
    res.end(data);
  });
};

exports.notFoundHelper = notFoundHelper = function(res) {
  res.writeHead(404, headers);
  res.end("File Not Found");
};

// As you progress, keep thinking about what helper functions you can put here!
