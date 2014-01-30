/*
Rushed ugly code by <thomasalwyndavis@gmail.com>

Will clean up and make available

*/
var MongoClient = require('mongodb').MongoClient,
    format = require('util').format;



var express = require('express');
var port = process.env.PORT || 8080;
var allowCrossDomain = function(req, res, next) {
    var allowedHost = [
        'http://dev.stopwatching.us',
        'http://rally.stopwatching.us',
        'http://2.stopwatching.us',
        'http://localhost:4000',
        'https://dev.stopwatching.us',
        'https://rally.stopwatching.us',
        'https://2.stopwatching.us',
        'https://localhost:4000',
        'https://thedaywefightback.org',
        'http://thedaywefightback.org',
        'https://thedaywefightback.org/',
        'http://thedaywefightback.org/'
    ];
    if (allowedHost.indexOf(req.headers.referer) !== -1 || allowedHost.indexOf(req.headers.origin) !== -1) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin)
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
        next();
    } else {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

        next();
    }
}
MongoClient.connect(process.env.MONGOHQ_URL, function(err, db) {
    if (err) throw err;

    var collection = db.collection('emails');
    var server = express();
    server.use(express.bodyParser());
    server.use(allowCrossDomain);

    server.options("*", function(req, res, next) {
        res.send({});
    });


    server.get('/count', function(req, res, next) {
      collection.count(function(err, count) {
        res.jsonp({count: count});
      })
      //res.setHeader("Expires", new Date(Date.now() + 5 * 60 * 1000).toUTCString());



    });
    server.get('/', function(req, res, next) {

        //collection.insert(mgg, function(err, docs) {console.log('Saved Email')});

        res.jsonp({message: 'Welcome to email congress'}); // Do something with your data!

    });

    server.get('/email', function(req, res, next) {
        var email = {
          from: req.query.from,
          message: req.query.message
        }
        collection.insert(email, function(err, docs) {
          res.jsonp({message: 'Email added'}); // Do something with your data!
        });


    });




    server.listen(port, function() {
        console.log('%s listening at %s', server.name, server.url);
    });

})