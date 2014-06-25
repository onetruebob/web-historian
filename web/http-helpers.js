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

  var findFileInPublic = function(res, asset) {
    var assetPath = archive.paths.siteAssets + asset;

    fs.readFile(assetPath, findInPublicResult);
  };

  var findInPublicResult = function (error, data){
    if (error){
      // Not found in Public. Go look in sites.
      findFileInSites(res, asset);
    } else {
      sendFileData(res, data);
    }
  };

  var findFileInSites = function (res, asset){
    var assetPath = archive.paths.archivedSites + asset;

    fs.readFile(assetPath, findInSitesResult);
  };

  var findInSitesResult = function(error, data){
    if(error) {
      //Not found in any location. Return error.
      notFoundHelper(res);
    } else {
      sendFileData(res, data);
    }
  };

  var sendFileData = function(res, data){
    res.writeHead(200, headers);
    res.end(data);
  };

  // Start the search in the public directory. Delegates to findInSites if not found.
  findFileInPublic(res, asset);
};

exports.notFoundHelper = notFoundHelper = function(res) {
  res.writeHead(404, headers);
  res.end("File Not Found");
};



// As you progress, keep thinking about what helper functions you can put here!
