var router = require('express').Router();

mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
  mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
  mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
  mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
  mongoPassword = process.env[mongoServiceName + '_PASSWORD']
  mongoUser = process.env[mongoServiceName + '_USER'];

if (mongoHost && mongoPort && mongoDatabase) {
mongoURLLabel = mongoURL = 'mongodb://';
if (mongoUser && mongoPassword) {
  mongoURL += mongoUser + ':' + mongoPassword + '@';
}
// Provide UI label that excludes user id and pw
mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

}
}
var db = null,
dbDetails = new Object();

var initDb = function(callback) {
if (mongoURL == null) return;

var mongodb = require('mongodb');
if (mongodb == null) return;

mongodb.connect(mongoURL, function(err, conn) {
if (err) {
  callback(err);
  console.log('MongoURL invalid: %s', mongoURL);
  return;
}

db = conn;
dbDetails.databaseName = db.databaseName;
dbDetails.url = mongoURLLabel;
dbDetails.type = 'MongoDB';

console.log('Connected to MongoDB at: %s', mongoURL);
});
};

router.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: new Date(Date.now()).toLocaleString()});
    col.count(function(err, count){
      if (err) {
        console.log('Error running count. Message:\n'+err);
      }
      console.log('Count: ' + count);
      res.render('index', { pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
      res.render('index', { pageCountMessage : null});
  }
});

router.get('/addPost', function(req,res){
    var tags = db.collection('tags');
    tags.find().toArray(function(err, tagList) {
        res.render('addPost', { tags: tagList});
      });
})

/* list of posts with the featured tag */
router.get('/featuredtest', function(req,res){
    var posts = db.collection('posts');
    posts.find({featured: "on"}).toArray(function(err, documents) {
        res.render('featuredtest', { posts: documents});
      });
})

/* post admin page for editing and deleting posts */
router.get('/postOverview', function(req,res){
    var posts = db.collection('posts');
    posts.find().toArray(function(err, documents) {
        res.render('postOverview', { posts: documents});
      });
})

/* Add new project post */
router.post('/addpost', (req, res) => {
    var col = db.collection('posts');
    // Create a document with request IP and current time of request
    console.log(req.body.tag);
    col.insert(req.body);
    res.redirect('/postOverview');
});

 /* Add new tag option to project posts */
router.post('/addTag', function(req, res){
    var tags = db.collection('tags');
    tags.insert(req.body);
	res.send(req.body);
});


initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

module.exports = router;
