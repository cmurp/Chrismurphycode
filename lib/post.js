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
      var posts = db.collection('posts');
      posts.find({featured: "on"}).toArray(function(err, documents) {
          res.render('index', { posts: documents});
        });
    }
});

router.get('/addProject', function(req,res){
    var projects = db.collection('projects');
    var tags = db.collection('tags');
    var tagList;
    tags.find().toArray(function(err, tagTemp) {
        tagList = tagTemp;
      });
    projects.find().toArray(function(err, projectList){
        res.render('addProject', {projects: projectList, tags: tagList});
    });
})

router.get('/addPost', function(req,res){
    var projects = db.collection('projects');
    var tags = db.collection('tags');
    var tagList;
    tags.find().toArray(function(err, tagTemp) {
        tagList = tagTemp;
      });
    projects.find().toArray(function(err, projectList){
        res.render('addPost', {projects: projectList, tags: tagList});
    });
})

router.get('/admin', function(req,res){
    res.render('admin');
})

/* post admin page for editing and deleting posts */
router.get('/projectOverview', function(req,res){
    var projects = db.collection('projects');
    projects.find().toArray(function(err, documents) {
        res.render('projectOverview', { projects: documents});
      });
})

/* Add new project post */
router.post('/addPost', (req, res) => {
    var col = db.collection('posts');
    // Create a document with request IP and current time of request
    req.body.time = new Date(Date.now()).toLocaleString();
    console.log(req.body);
    col.insert(req.body);
    res.redirect('/projectOverview');
});

/* Add new project */
router.post('/addProject', (req, res) => {
    var col = db.collection('projects');
    // Create a document with request IP and current time of request
    col.insert(req.body);
    res.redirect('/projectOverview');
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
