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
    callbackURL: process.env.AUTH0_CALLBACK_URL || '/callback'
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

router.get('/admin', secured(), function(req,res){
    mongodb.getCollection('projects', function(projects){
        projects.find().toArray(function(err, documents) {
            res.render('admin', { projects: documents});
          });
    });
});

router.get('/admin/postOverview', secured(), function(req,res){
    mongodb.getCollection('posts', function(posts){
        posts.find().toArray(function(err, documents) {
            res.render('postOverview', { posts: documents});
          });
    });
});

router.get('/admin/addProject', secured(), function(req,res){
    mongodb.getCollection('projects', function(projects) {
        mongodb.getCollection('tags', function(tags) {
            var tagList;
            tags.find().toArray(function(err, tagTemp) {
                tagList = tagTemp;
              });
            projects.find().toArray(function(err, projectList){
                res.render('addProject', {projects: projectList, tags: tagList});
            });
        });
    });
});

router.get('/admin/addPost', secured(), function(req,res){
    mongodb.getCollection('projects', function(projects) {
        mongodb.getCollection('tags', function(tags) {
            var tagList;
            tags.find().toArray(function(err, tagTemp) {
                tagList = tagTemp;
              });
            projects.find().toArray(function(err, projectList){
                res.render('addPost', {projects: projectList, tags: tagList});
            });
        });
    });
});

/* edit a project in the database */
router.get('/admin/editProject/:project', secured(), function(req,res){
    mongodb.getCollection('projects', function(projectsCol){
        mongodb.getCollection('posts', function(postsCol){
            mongodb.getCollection('tags', function(tags){
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
        });
    });
    
});

/* shows requested post for requested project */
router.get('/admin/editPost/:project/:post', secured(), function(req,res){
    mongodb.getCollection('posts', function(postsCol){
        var query = {"title" : req.params.post};
        mongodb.getCollection('tags', function(tags){
            var tagList;
            tags.find().toArray(function(err, tagTemp) {
                tagList = tagTemp;
              });
        
            postsCol.findOne(query, function(err, post){
                if(err) throw err;
                res.render('editPost', { project: req.params.project , post: post, tags: tagList});
            });
        });
    });

});


/* Add new project post */
router.post('/addPost', secured(), (req, res) => {
    mongodb.getCollection('posts', function(posts){
        // Create a document with request IP and current time of request
        req.body.time = new Date(Date.now()).toLocaleString();
        posts.insert(req.body);
        res.redirect('/admin');
    });
});

/* Edit project post */
router.post('/editPost', secured(), (req, res) => {
    mongodb.getCollection('posts', function(posts){
        // Create a document with request IP and current time of request
        req.body.updated = new Date(Date.now()).toLocaleString();
        var query = {"_id" : new mongodb.mongodb.ObjectID(req.body.id)};
        delete req.body['id'];
        posts.updateOne(query, { $set: req.body }, function(err, res) {
            if (err) throw err;
        });
        res.redirect('/admin');
    });
});

/* Add new project */
router.post('/addProject', secured(), (req, res) => {
    mongodb.getCollection('projects', function(projects){
        // Create a document with request IP and current time of request
        projects.insert(req.body);
        res.redirect('/admin');
    });
});

/* Edit project */
router.post('/editProject', secured(), (req, res) => {
    mongodb.getCollection('projects', function(projects){
        // Create a document with request IP and current time of request
        var query = {"_id" : new mongodb.mongodb.ObjectID(req.body.id)};
        delete req.body['id'];
        projects.updateOne(query, { $set: req.body }, function(err, res) {
            if (err) throw err;
        });
        res.redirect('/admin');
    });
});

/* Remove project */
router.post('/removeProject', secured(), function(req, res){
    mongodb.getCollection('projects', function(projects){
        mongodb.getCollection('posts', function(posts){
            projects.remove({_id : new mongodb.mongodb.ObjectID(req.body.project)}, function(err, obj) {
                if (err) throw err;
                console.log(obj.result.n + " document(s) deleted");
            });
            posts.remove({project : req.body.project}, function(err, obj) {
                 if (err) throw err;
                 console.log(obj.result.n + " document(s) deleted");
             });
           res.send(req.body.project);
        });
    });
});

/* Remove post */
router.post('/removePost', secured(), function(req, res){
    mongodb.getCollection('posts', function(posts){
        posts.remove({_id : new mongodb.mongodb.ObjectID(req.body.post)}, function(err, obj) {
            if (err) throw err;
            console.log(obj.result.n + " document(s) deleted");
        });
        res.send(req.body.post);
    });
});

 /* Add new tag option to project posts */
router.post('/addTag', secured(), function(req, res){
    mongodb.getCollection('tags', function(tags){
        tags.insert(req.body);
        res.send(req.body);
    });
});

/* Remove tag option to project posts */
router.post('/removeTag', secured(), function(req, res){
    mongodb.getCollection('tags', function(tags){
        tags.remove({_id : new mongodb.mongodb.ObjectID(req.body.tag)}, function(err, obj) {
            if (err) throw err;
            console.log(obj.result.n + " document(s) deleted");
        });
        res.send(req.body.tag);
    });
});

module.exports = router;
