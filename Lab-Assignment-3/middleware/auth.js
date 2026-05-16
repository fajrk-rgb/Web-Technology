module.exports.isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) return next();
  req.flash('error', 'Please login first');
  return res.redirect('/login');
};

module.exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') return next();
  req.flash('error', 'Access Denied');
  return res.redirect('/');
};
