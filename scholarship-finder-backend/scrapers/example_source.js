
const BaseScraper = require('./base_scraper');
const cheerio    = require('cheerio');
const axios      = require('axios');

class ScholarshipIndiaScraper extends BaseScraper {
  constructor() {
    super('https://www.scholarshipsinindia.com/', 'ScholarshipsInIndia');
  }

  async parsePage(html, pageNumber) {
    console.log(`Parsing page ${pageNumber}`);
    const $ = cheerio.load(html);
    const items = [];

    const cards = $('.event.event_left').toArray();
    for (const el of cards) {
      const $el          = $(el);
      const titleEl      = $el.find('.event_title a');
      const title        = titleEl.text().trim();
      const link         = titleEl.attr('href')?.trim() || '';
      const textParas    = $el.find('.event_text p');
      const description  = textParas.first().text().trim();
      const rawDeadline  = textParas.eq(1).text().trim();
      const deadline     = rawDeadline.replace(/^Last Date\s*:\s*/i, '');
      const titleLower       = title.toLowerCase();
      const descriptionLower = description.toLowerCase();
      if (
        !titleLower.includes('scholarship') &&
        !descriptionLower.includes('scholarship')
      ) {
        continue;
      }

      let amount           = '';
      let educationLevel   = 'open';
      let genderPreference = 'open';
      let castePreference  = 'open';
      let applyLink        = '';        

      if (link) {
        try {
          
          const detailHtml = await axios
            .get(link, {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                  '(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                Referer: this.url,
              },
            })
            .then(res => res.data);

          const $detail = cheerio.load(detailHtml);

          
          const amountText = $detail('p')
            .filter((i, pel) => {
              const txt = $detail(pel).text().toLowerCase();
              return (
                txt.includes('amount') ||
                txt.includes('scholarship amount') ||
                txt.includes('award')
              );
            })
            .first()
            .text();
          amount = this.extractAmount(amountText) || 'Not specified';

         
          const allDetailParagraphs = $detail('p')
            .toArray()
            .map(pel => $detail(pel).text())
            .join(' ');

         
          const extractedEdu = this.extractEducationFromText(allDetailParagraphs);
          if (extractedEdu) educationLevel = extractedEdu;

         
          const extractedGender = this.extractGenderFromText(title);
          if (extractedGender) genderPreference = extractedGender;

    
          const extractedCaste = this.extractCasteFromText(allDetailParagraphs);
          if (extractedCaste) castePreference = extractedCaste;

          
          const anchorHref = $detail('a')
            .filter((i, anchor) => {
              const txt = ($detail(anchor).text() || '').toLowerCase();
              return (
                /apply/i.test(txt) ||
                /official publisher/i.test(txt) ||
                /official website/i.test(txt)
              );
            })
            .first()
            .attr('href');
          if (anchorHref) {
            applyLink = anchorHref.trim();
          }

          
          if (!applyLink) {
            const bodyText = $detail('body').text();
            const shortMatch = bodyText.match(/short url[:\s]*([\w./-]+)/i);
            if (shortMatch && shortMatch[1]) {
              let url = shortMatch[1].trim();
              if (!/^https?:\/\//i.test(url)) {
                url = 'http://' + url;
              }
              applyLink = url;
            }
          }
        } catch (err) {
          console.error(`Error fetching detail page for "${title}": ${err.message}`);
        }
      }

      if (!amount) amount = 'Not specified';

      if (title && link) {
        items.push({
          title,
          link,
          applyLink,       
          source: this.sourceName,
          description,
          amount,
          deadline,
          eligibility: '',
          educationLevel,
          genderPreference,
          castePreference,
        });
      }
    }

    console.log(`🎯 Parsed ${items.length} scholarships from ${this.sourceName}`);
    return items;
  }

  extractAmount(text) {
    if (!text) return '';
    const patterns = [
      /₹\s?[0-9,]+(\s?(per\s?(month|year))?)?/i,
      /Rs\.?\s?[0-9,]+(\s?(per\s?(month|year))?)?/i,
      /(?:amount|award)[^₹Rs\d]{0,15}[:\-–]?\s*(₹|Rs\.?)?\s?[0-9,]+/i,
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[0].trim();
    }
    return '';
  }
}

module.exports = ScholarshipIndiaScraper;
