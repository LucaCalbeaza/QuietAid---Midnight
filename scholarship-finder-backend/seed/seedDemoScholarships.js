/**
 * QuietAid demo seed script.
 *
 *   npm run seed              non-destructive (default)
 *   npm run seed -- --fresh   destructive reset
 *
 * Default: inserts six fictional U.S. scholarships (see ./demoScholarships.data.js)
 * into MongoDB using the existing Scholarship model and the DB_URI environment
 * variable (via db.js). Safe to run repeatedly: each record is upserted on the
 * stable key { source: 'QuietAid Demo Seed', title }, so re-running updates the
 * existing rows instead of creating duplicates. Data from other sources (e.g. the
 * scraper) is never touched.
 *
 * --fresh: deletes EVERY document in the scholarships collection first, then
 * inserts exactly the six demo scholarships. Use this to get a clean demo DB.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../db');
const Scholarship = require('../models/Scholarship');
const { analyzeSentiment } = require('../utils/sentiment');
const {
  DEMO_SOURCE,
  DEMO_DISCLAIMER,
  scholarships,
} = require('./demoScholarships.data');

const FRESH = process.argv.slice(2).includes('--fresh');

function buildDoc(entry) {
  const sentimentText = entry.description || entry.title;
  const sentiment = analyzeSentiment(sentimentText);

  return {
    ...entry,
    source: DEMO_SOURCE,
    type: 'scholarship',
    isDemoData: true,
    demoDisclaimer: DEMO_DISCLAIMER,
    lastUpdated: new Date(),
    sentiment: {
      vader: {
        pos: sentiment.sentimentScores.pos,
        neu: sentiment.sentimentScores.neu,
        neg: sentiment.sentimentScores.neg,
        compound: sentiment.sentimentScores.compound,
      },
      classification: sentiment.classification,
      compoundScore: sentiment.compoundScore,
    },
  };
}

async function seedFresh() {
  const docs = scholarships.map(buildDoc);

  const deleted = await Scholarship.deleteMany({});
  await Scholarship.insertMany(docs);

  console.log('\nQuietAid demo seed complete (--fresh).');
  console.log(`  source:            ${DEMO_SOURCE}`);
  console.log(`  deleted (all):     ${deleted.deletedCount ?? 0}`);
  console.log(`  inserted:          ${docs.length}`);
}

async function seedUpsert() {
  const operations = scholarships.map((entry) => {
    const doc = buildDoc(entry);
    return {
      updateOne: {
        filter: { source: DEMO_SOURCE, title: doc.title },
        update: { $set: doc },
        upsert: true,
      },
    };
  });

  const result = await Scholarship.bulkWrite(operations, { ordered: false });

  const inserted = result.upsertedCount ?? 0;
  const updated = result.modifiedCount ?? 0;
  const unchanged = scholarships.length - inserted - updated;

  console.log('\nQuietAid demo seed complete.');
  console.log(`  source:     ${DEMO_SOURCE}`);
  console.log(`  inserted:   ${inserted}`);
  console.log(`  updated:    ${updated}`);
  console.log(`  unchanged:  ${unchanged}`);
}

async function seed() {
  await connectDB();

  if (FRESH) {
    await seedFresh();
  } else {
    await seedUpsert();
  }

  const demoCount = await Scholarship.countDocuments({ source: DEMO_SOURCE });
  const totalCount = await Scholarship.countDocuments({});
  console.log(`  demo records in DB:  ${demoCount}`);
  console.log(`  total scholarships:  ${totalCount}`);
  console.log('\nAll seeded scholarships are fictional demo data.\n');
}

seed()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Seed failed:', error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });
