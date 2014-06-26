var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');
// require more modules/folders here!


var getHandler = function(req, res){
  var requestedFile = req.url.split("?")[0];

  if(requestedFile === '/'){
    requestedFile = '/index.html';
  }

  httpHelpers.serveAssets(res, requestedFile);
};

var postHandler = function(req, res){
  httpHelpers.createArchiveRequest(req, res);
};

var statusRouter = {
  "GET": getHandler,
  "POST": postHandler,
  //"OPTIONS": optionsHandler
};

exports.handleRequest = function (req, res) {
  statusRouter[req.method](req, res);
};
