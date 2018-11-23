var router = require('express').Router();
var mongodb = require('./mongodb.js');

//admin routes
router.use(require('./admin.js'));

router.get('/', function (req, res) {
    var projects = mongodb.db.collection('projects');
    projects.find({featured: "on"}).toArray(function(err, documents) {
      res.render('index', { projects: documents});
    });
});

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

module.exports = router;
