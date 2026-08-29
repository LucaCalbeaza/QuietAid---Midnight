// backend/backfillScholarshipType.js
/*require('dotenv').config();
const mongoose = require('mongoose');
const Scholarship = require('./models/Scholarship');

const uri = process.env.DB_URI || 'mongodb://localhost:27017/scholarship-finder';

async function runBackfill() {
  try {
    // Connect without deprecated options
    await mongoose.connect(uri);
    console.log('Connected to MongoDB (backfill)');

    // Update any document missing a `type` field to have type: 'scholarship'
    const result = await Scholarship.updateMany(
      { type: { $exists: false } },    // match docs lacking `type`
      { $set: { type: 'scholarship' } } // set type = "scholarship"
    );

    console.log(`Backfill complete. Modified ${result.modifiedCount} documents.`);
    process.exit(0);
  } catch (err) {
    console.error('Backfill error:', err);
    process.exit(1);
  }
}

runBackfill();
*/