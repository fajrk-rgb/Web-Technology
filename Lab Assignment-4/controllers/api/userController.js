const User = require('../../models/User');

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
}

module.exports = {
  getProfile
};
