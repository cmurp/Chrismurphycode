var router = require('express').Router();
var secured = require('./secured.js');
var mongodb = require('./mongodb.js');
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

// Configure Passport to use Auth0
var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:8080/callback'
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

passport.use(strategy);

router.use(passport.initialize());
router.use(passport.session());

// You can use this section to keep a smaller payload
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

router.use(require('./auth.js'));

router.get('/', function (req, res) {
    var projects = mongodb.db.collection('projects');
    projects.find({featured: "on"}).toArray(function(err, documents) {
      res.render('index', { projects: documents});
    });
});

router.get('/admin', secured(), function(req,res){
    var projects = mongodb.db.collection('projects');
    projects.find().toArray(function(err, documents) {
        res.render('admin', { projects: documents});
      });
});

router.get('/admin/addProject', secured(), function(req,res){
    var projects = mongodb.db.collection('projects');
    var tags = mongodb.db.collection('tags');
    var tagList;
    tags.find().toArray(function(err, tagTemp) {
        tagList = tagTemp;
      });
    projects.find().toArray(function(err, projectList){
        res.render('addProject', {projects: projectList, tags: tagList});
    });
});

router.get('/admin/addPost', secured(), function(req,res){
    var projects = mongodb.db.collection('projects');
    var tags = mongodb.db.collection('tags');
    var tagList;
    tags.find().toArray(function(err, tagTemp) {
        tagList = tagTemp;
      });
    projects.find().toArray(function(err, projectList){
        res.render('addPost', {projects: projectList, tags: tagList});
    });
});

/* edit a project in the database */
router.get('/admin/editProject/:project', secured(), function(req,res){
    var projectsCol = mongodb.db.collection('projects');
    var postsCol = mongodb.db.collection('posts');

    var tags = mongodb.db.collection('tags');
    var tagList;
    tags.find().toArray(function(err, tagTemp) {
        tagList = tagTemp;
      });

    projectsCol.findOne({"name" : req.params.project}, function(err, project) {
        if(err) throw err;
        postsCol.find({"project" : project._id.toString()}).toArray(function(err, posts){
            if(err) throw err;
            res.render('editProject', { project: project, posts: posts, tags: tagList});
        });
    });
});

/* shows requested post for requested project */
router.get('/admin/editPost/:project/:post', secured(), function(req,res){
    var postsCol = mongodb.db.collection('posts');
    var query = {"title" : req.params.post};
    var tags = mongodb.db.collection('tags');
    var tagList;
    tags.find().toArray(function(err, tagTemp) {
        tagList = tagTemp;
      });

    postsCol.findOne(query, function(err, post){
            if(err) throw err;
            res.render('editPost', { project: req.params.project , post: post, tags: tagList});
    });
})

/* post admin page for editing and deleting posts */
router.get('/projects', function(req,res){
    var projects = mongodb.db.collection('projects');
    projects.find().toArray(function(err, documents) {
        res.render('projects', { projects: documents});
      });
});

/* project overview page with all posts for the given project */
router.get('/projects/:project', function(req,res){
    var projectsCol = mongodb.db.collection('projects');
    var postsCol = mongodb.db.collection('posts');

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
    var postsCol = mongodb.db.collection('posts');
    var query = {"title" : req.params.post};
    postsCol.findOne(query, function(err, post){
            if(err) throw err;
            postsCol.update(query,{ $inc: { count: 1 }});
            res.render('post', { project: req.params.project , post: post});
    });
});

/* Add new tag option to project posts */
router.post('/getTag', function(req, res){
   var tags = mongodb.db.collection('tags');
   tags.findOne({"tag" : req.body.tag}, function(err, document){
       if(err) throw err;
       res.send(document);
   });
});

/* Add new project post */
router.post('/addPost', secured(), (req, res) => {
    var col = mongodb.db.collection('posts');
    // Create a document with request IP and current time of request
    req.body.time = new Date(Date.now()).toLocaleString();
    col.insert(req.body);
    res.redirect('/projects');
});

/* Edit project post */
router.post('/editPost', secured(), (req, res) => {
    var col = mongodb.db.collection('posts');
    // Create a document with request IP and current time of request
    req.body.updated = new Date(Date.now()).toLocaleString();
    var query = {"_id" : new mongodb.mongodb.ObjectID(req.body.id)};
    delete req.body['id'];
    col.updateOne(query, { $set: req.body }, function(err, res) {
        if (err) throw err;
    });
    res.redirect('/admin');
});

/* Add new project */
router.post('/addProject', secured(), (req, res) => {
    var col = mongodb.db.collection('projects');
    // Create a document with request IP and current time of request
    col.insert(req.body);
    res.redirect('/projects');
});

/* Edit project */
router.post('/editProject', secured(), (req, res) => {
    var col = mongodb.db.collection('projects');
    // Create a document with request IP and current time of request
    var query = {"_id" : new mongodb.mongodb.ObjectID(req.body.id)};
    delete req.body['id'];
    col.updateOne(query, { $set: req.body }, function(err, res) {
        if (err) throw err;
    });
    res.redirect('/admin');
});

 /* Add new tag option to project posts */
router.post('/addTag', secured(), function(req, res){
    var tags = mongodb.db.collection('tags');
    tags.insert(req.body);
	res.send(req.body);
});

/* Add new tag option to project posts */
router.post('/removeTag', secured(), function(req, res){
   var tags = mongodb.db.collection('tags');
   tags.remove({_id : new mongodb.mongodb.ObjectID(req.body.tag)}, function(err, obj) {
    if (err) throw err;
    console.log(obj.result.n + " document(s) deleted");
  });
   console.log(req.body.tag);
   res.send(req.body.tag);
});

module.exports = router;
