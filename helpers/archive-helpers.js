var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = readListOfUrls = function(callback){
  fs.readFile(paths.list, {encoding: 'utf8'},function(error, data){
    if (error) throw error;
    data = data.split('\n');
    callback(data);
  });
};

exports.isUrlInList = function(url, callback){
  readListOfUrls(function(data){
    var urlFound = data.indexOf(url) === -1 ? false : true; //TODO: Revisit searching for URL in list
    callback(urlFound);
  });
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(paths.list, url + '\n', {encoding: 'utf8'}, callback);
};

exports.isURLArchived = function(url, callback){
  fs.exists(paths.archivedSites + '/' + url, callback);
};

exports.downloadUrls = function(){
};

