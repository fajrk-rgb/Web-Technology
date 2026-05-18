const User = require('../models/User');

function showLogin(req, res) {
  res.render('login');
}

function showRegister(req, res) {
  res.render('register');
}

async function register(req, res) {
  const { name, email, password, confirm } = req.body;

  if (!name || !email || !password || !confirm) {
    req.flash('error', 'All fields are required');
    return res.redirect('/register');
  }

  if (password.length < 6) {
    req.flash('error', 'Password must be at least 6 characters');
    return res.redirect('/register');
  }

  if (password !== confirm) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('/register');
  }

  try {
    const existing = await User.findOne({ email });

    if (existing) {
      req.flash('error', 'Email already registered');
      return res.redirect('/register');
    }

    const user = new User({ name, email, password });
    await user.save();

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    req.flash('success', 'Registration successful');
    return res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed');
    return res.redirect('/register');
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('error', 'All fields are required');
    return res.redirect('/login');
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    const match = await user.comparePassword(password);

    if (!match) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    req.flash('success', 'Login successful');

    if (user.role === 'admin') {
      return res.redirect('/admin');
    }

    return res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Login failed');
    return res.redirect('/login');
  }
}

function logout(req, res) {
  if (!req.session) return res.redirect('/');
  req.session.user = null;
  req.flash('success', 'You have successfully logged out');
  req.session.save(err => {
    if (err) console.error(err);
    return res.redirect('/');
  });
}

function profile(req, res) {
  res.render('profile', { user: req.session.user });
}

module.exports = {
  showLogin,
  showRegister,
  register,
  login,
  logout,
  profile
};
