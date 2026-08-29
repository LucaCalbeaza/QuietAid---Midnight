/**
 * Seed a demo provider account (role=provider).
 * Usage: node seed/seedProviderUser.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

async function main() {
  const uri = process.env.DB_URI || 'mongodb://localhost:27017/scholarship-finder';
  await mongoose.connect(uri);

  const email = process.env.PROVIDER_EMAIL || 'provider@quietaid.demo';
  const password = process.env.PROVIDER_PASSWORD || 'Provider1!demo';

  let user = await User.findOne({ email });
  if (user) {
    user.role = 'provider';
    user.password = password;
    await user.save();
    console.log('Updated existing user to provider:', email);
  } else {
    user = new User({
      firstName: 'Quiet',
      lastName: 'Provider',
      email,
      password,
      educationLevel: 'undergraduate',
      currentInstitution: 'QuietAid Demo Provider Org',
      dateOfBirth: new Date('1990-01-01'),
      location: { country: 'United States', state: '', city: '' },
      role: 'provider',
    });
    await user.save();
    console.log('Created provider user:', email);
  }

  console.log('Login with:', email, '/', password);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
