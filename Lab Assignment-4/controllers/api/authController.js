const jwt = require('jsonwebtoken');
const User = require('../../models/User');

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'JWT secret not configured' });
  }

  try {
    const user = await User.findOne({ email: String(email).toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await user.comparePassword(password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        user_id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Login failed' });
  }
}

module.exports = {
  login
};
