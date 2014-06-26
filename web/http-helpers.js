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
    asset = asset[0] === '/' ? asset.slice(1) : asset;
    archive.getHtmlforUrl(asset, findInSitesResult);

    // var assetPath = archive.paths.archivedSites + asset;

    // fs.readFile(assetPath, findInSitesResult);
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

exports.createArchiveRequest = function (req, res){
  var archiveURL ='';

  var redirectToURL = function(url) {
    headers.location = url;
    res.writeHead(302, headers);
    res.end();
    delete headers.location;
  };

  var urlArchivedResult = function(exists) {
    if (exists) {
      redirectToURL(archiveURL);
    } else {
      archive.isUrlInList(archiveURL, urlInListResult);
    }
  };

  var urlInListResult = function (urlFound){
    if(!urlFound) {
      archive.addUrlToList(archiveURL, function(err){
        if (err) throw err;
        redirectToURL('loading.html');
      });
    } else {
      redirectToURL('loading.html');
    }

  };

  //call handlers to get the archive URL and then pass it to functions
  //to add it to the list and return results.
  req.on('data', function(chunk){
    archiveURL += chunk;
  });

  req.on('end', function(){
    console.log(archiveURL);
    archiveURL = archiveURL.split('=')[1];
    archive.isURLArchived(archiveURL, urlArchivedResult);
  });
};
