var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpRequest = require('http-request');
var mysql = require('mysql');

 var connection =  mysql.createConnection({
    host : "127.0.0.1",
    user : "root",
    database: "WA"
  });

 connection.connect(function(err) {
  if (err) throw err;
 });

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
  connection.query('select url from archive', function(error, rows){
    if (error) throw error;
    var urls = rows.map(function(val){
      return val.url;
    });
    callback(urls);
  });
};

exports.isUrlInList = function(url, callback){
  readListOfUrls(function(data){
    var urlFound = data.indexOf(url) === -1 ? false : true; //TODO: Revisit searching for URL in list
    callback(urlFound);
  });
};

exports.addUrlToList = function(url, callback){
  connection.query('insert into archive (url) VALUES ("'+ url +'")', callback);
};

exports.isURLArchived = isURLArchived = function(url, callback){
  connection.query('select * from archive where url = ?', [url], function(error, rows){
    if (error) throw error;
    var urlFound = rows.length > 0 && rows[0].html ? true : false;
    callback(urlFound, url);
  });
  // fs.exists(paths.archivedSites + '/' + url, function(urlFound){
  //   callback(urlFound, url);
  // });
};

exports.downloadUrls = function(){
  var connectionCount = 0;

  var clearWhenConnectionComplete = function(){
    if(connectionCount === 0) {
      connection.destroy();
    }
  };
  readListOfUrls(function(urlArray){
    for(var i = 0; i < urlArray.length; i++) {
      connectionCount++;
      isURLArchived(urlArray[i], function(urlFound, url){
        if(!urlFound){
          httpRequest.get('http://' + url, function(error, res){
            if(error) console.log('Error downloading:', error);
            //UPDATE Users SET weight = 160, desiredWeight = 145 WHERE id = 1;
            connection.query('update archive set html = ? where url = ?', [res.buffer.toString(), url], function (error){
              if (error) throw error;
              console.log("update done");
              connectionCount--;
              clearWhenConnectionComplete();
            });
          });
        } else {
          connectionCount--;
          clearWhenConnectionComplete();
        }
      });
    }
  });
};

exports.getHtmlforUrl = function(url, callback) {
  connection.query('select html from archive where url = ?', [url], function(error, rows){
    if (error) throw error;
    if(rows.length > 0 && rows[0].html) {
      callback(null, rows[0].html);
    } else {
      callback('Not found', null);
    }
  });
};

