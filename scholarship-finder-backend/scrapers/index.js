require('dotenv').config();
const connectDB = require('../db');

const ScholarshipIndiaScraper = require('./example_source');

async function runScraper() {
  try {
    
    await connectDB();

  
    const scraper = new ScholarshipIndiaScraper();
    console.log(`\n Running scraper for: ${scraper.sourceName}`);

    // 3) Fetch & store
    const items = await scraper.handlePagination();
    await scraper.storeData(items);

    console.log('\n Scraper completed successfully');
    process.exit(0);
  } catch (error) {
    console.error(' Error running scraper:', error.message);
    process.exit(1);
  }
}

runScraper();
