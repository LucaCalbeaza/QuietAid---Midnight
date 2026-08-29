const axios = require('axios');
const cheerio = require('cheerio');
const Scholarship = require('../models/Scholarship');
const { analyzeSentiment } = require('../utils/sentiment');

class BaseScraper {
  constructor(url, sourceName) {
    this.url = url;
    this.sourceName = sourceName;
    this.currentPage = 1;
  }

 
  async fetchPage(pageUrl = this.url) {
    try {
      const response = await axios.get(pageUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
          Referer: this.url,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching page (${pageUrl}): ${error.message}`);
      return null;
    }
  }

 
  async handlePagination() {
    const allItems = [];
    while (true) {
      const pageUrl = this.getPageUrl(this.currentPage);
      console.log(`🔎 Fetching page ${this.currentPage}: ${pageUrl}`);
      const html = await this.fetchPage(pageUrl);
      if (!html) break;

      const pageItems = await this.parsePage(html, this.currentPage);
      console.log(`📄 Parsed ${pageItems.length} items from page ${this.currentPage}`);
      if (pageItems.length === 0) break;

      allItems.push(...pageItems);

      if (!this.getNextPage(cheerio.load(html))) break;
      this.currentPage += 1;
    }
    return allItems;
  }

  
  async storeData(items) {
    if (!items.length) {
      console.log('ℹ️ No items to store');
      return;
    }
    try {
      
      await Scholarship.deleteMany({ source: this.sourceName });

      
      const itemsWithSentiment = items.map(itm => {
        const sentimentResult = analyzeSentiment(itm.description || itm.title);
        return {
          ...itm,
          sentiment: {
            sentimentScores: sentimentResult.sentimentScores,
            classification: sentimentResult.classification,
            compoundScore: sentimentResult.compoundScore,
          },
        };
      });

      
      await Scholarship.insertMany(itemsWithSentiment);

      console.log(`Successfully replaced scholarships from ${this.sourceName} with ${items.length} new entries`);
    } catch (error) {
      console.error(`Error storing data: ${error.message}`);
    }
  }

 
  extractEducationFromText(text = '') {
    if (!text) return null;
    const h = text.toLowerCase();

  
    const hsPattern = /\b(?:10|11|12)(?:th|st|nd|rd)?\b/;
    const classPattern = /\bclass\s?(?:10|11|12)(?:th|st|nd|rd)?\b/;
    if (hsPattern.test(h) || classPattern.test(h)) {
      return 'highSchool';
    }

   
    const hasUG = /\bundergraduate\b/.test(h) || /\bug\b/.test(h);
    const hasPG = /\bpostgraduate\b/.test(h) || /\bpg\b/.test(h);
    if (hasUG && hasPG) {
      return 'ug_pg';
    }
    if (hasUG) {
      return 'undergraduate';
    }
    if (hasPG) {
      return 'graduate';
    }


    if (/\bphd\b/.test(h)) {
      return 'phd';
    }

    return null;
  }

  extractGenderFromText(text = '') {
    if (!text) return null;
    const h = text.toLowerCase();
    if (/\bwomen\b/.test(h) || /\bfemale\b/.test(h) || /\bgirls\b/.test(h)) {
      return 'female';
    }
    if (/\bmen\b/.test(h) || /\bmale\b/.test(h) || /\bboys\b/.test(h)) {
      return 'male';
    }
    return null;
  }

  extractCasteFromText(text = '') {
    if (!text) return null;
    const h = text.toLowerCase();
    const mapping = [
      { re: /\bgeneral\b/, value: 'General' },
      { re: /\bobc\b/, value: 'OBC' },
      { re: /\bsc\b/, value: 'SC' },
      { re: /\bst\b/, value: 'ST' },
      { re: /\bews\b/, value: 'EWS' },
    ];
    for (const { re, value } of mapping) {
      if (re.test(h)) return value;
    }
    return null;
  }

  getPageUrl(pageNumber) {
    return this.url;
  }

  getNextPage($) {
    return false;
  }
}

module.exports = BaseScraper;
