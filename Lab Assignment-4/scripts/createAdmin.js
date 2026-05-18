const mongoose = require('mongoose');
const User = require('../models/User');

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ReadingsDB';

const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] || 'Admin';

if (!email || !password) {
  console.log('Usage: node scripts/createAdmin.js <email> <password> [name]');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(mongoUrl);

    const normalizedEmail = String(email).toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      user.name = name;
      user.password = password;
      user.role = 'admin';
      await user.save();
      console.log('Updated existing user to admin.');
    } else {
      user = new User({
        name,
        email: normalizedEmail,
        password,
        role: 'admin'
      });
      await user.save();
      console.log('Created admin user.');
    }
  } catch (err) {
    console.error('Failed to create admin user:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
