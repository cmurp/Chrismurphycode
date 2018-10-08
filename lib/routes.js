var router = require('express').Router(),
    mongodb = require('mongodb');

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
      var projects = db.collection('projects');
      projects.find({featured: "on"}).toArray(function(err, documents) {
          res.render('index', { projects: documents});
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
router.get('/projects', function(req,res){
    var projects = db.collection('projects');
    projects.find().toArray(function(err, documents) {
        res.render('projects', { projects: documents});
      });
})

/* project overview page with all posts for the given project */
router.get('/projects/:project', function(req,res){
    var projectsCol = db.collection('projects');
    var postsCol = db.collection('posts');

    projectsCol.findOne({"name" : req.params.project}, function(err, project) {
        if(err) throw err;
        postsCol.find({"project" : project._id.toString()}).toArray(function(err, posts){
            if(err) throw err;
            res.render('projectOverview', { project: project, posts: posts});
        });
    });
});

/* shows requested post for requested project */
router.get('/projects/:project/:post', function(req,res){
    var postsCol = db.collection('posts');
    var query = {"title" : req.params.post};
    postsCol.findOne(query, function(err, post){
            if(err) throw err;
            postsCol.update(query,{ $inc: { count: 1 }});
            res.render('post', { project: req.params.project , post: post});
    });
});

/* Add new tag option to project posts */
router.post('/getTag', function(req, res){
   var tags = db.collection('tags');
   tags.findOne({"tag" : req.body.tag}, function(err, document){
       if(err) throw err;
       res.send(document);
   });
});

/* Add new project post */
router.post('/addPost', (req, res) => {
    var col = db.collection('posts');
    // Create a document with request IP and current time of request
    req.body.time = new Date(Date.now()).toLocaleString();
    console.log(req.body);
    col.insert(req.body);
    res.redirect('/projects');
});

/* Add new project */
router.post('/addProject', (req, res) => {
    var col = db.collection('projects');
    // Create a document with request IP and current time of request
    col.insert(req.body);
    res.redirect('/projects');
});

 /* Add new tag option to project posts */
router.post('/addTag', function(req, res){
    var tags = db.collection('tags');
    tags.insert(req.body);
	res.send(req.body);
});

/* Add new tag option to project posts */
router.post('/removeTag', function(req, res){
   var tags = db.collection('tags');
   tags.remove({_id : new mongodb.ObjectID(req.body.tag)}, function(err, obj) {
    if (err) throw err;
    console.log(obj.result.n + " document(s) deleted");
  });
   console.log(req.body.tag);
   res.send(req.body.tag);
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

module.exports = router;
