var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/login', function(req, res, next) {
  passport.authenticate('auth0',  {scope: 'openid email profile'}, 
  function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }

    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/callback');
    });
  })(req, res, next);
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {
    if (err) { return next(err); }
    if (typeof user.emails == 'undefined') { return res.redirect('/login'); }
    if (!user || (user.emails[0].value != process.env.ADMIN_EMAIL)) { return res.redirect('/login'); }

    req.logIn(user, function (err) {
      if (err) { return next(err); }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || '/admin');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
