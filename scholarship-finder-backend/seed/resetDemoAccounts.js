/**
 * Wipe student/provider accounts and private applications for a clean demo.
 *
 *   npm run reset:accounts
 *
 * Keeps scholarships. Recreates the demo provider:
 *   provider@quietaid.demo / Provider1!demo
 *
 * Register a fresh student in the UI after this runs.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const PrivateApplication = require('../models/PrivateApplication');

async function main() {
  const uri = process.env.DB_URI || 'mongodb://localhost:27017/scholarship-finder';
  await mongoose.connect(uri);

  const apps = await PrivateApplication.deleteMany({});
  const users = await User.deleteMany({});

  const email = process.env.PROVIDER_EMAIL || 'provider@quietaid.demo';
  const password = process.env.PROVIDER_PASSWORD || 'Provider1!demo';

  await User.create({
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

  console.log('QuietAid demo accounts reset.');
  console.log(`  private applications deleted: ${apps.deletedCount ?? 0}`);
  console.log(`  users deleted:                ${users.deletedCount ?? 0}`);
  console.log(`  provider recreated:           ${email} / ${password}`);
  console.log('  Register a new student in the UI for the recording.');

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
