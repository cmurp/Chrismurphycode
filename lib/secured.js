module.exports = function () {
  return function secured (req, res, next) {
      console.log(req.user);
    if (req.isAuthenticated()) { return next(); }
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
  };
};
