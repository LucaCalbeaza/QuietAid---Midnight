const express = require('express');
const router = express.Router();
const { analyzeSentiment } = require('../utils/sentiment');

router.post('/analyze', (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for sentiment analysis' });
    }

    const sentimentResult = analyzeSentiment(text);

    res.json({ data: sentimentResult });
  } catch (error) {
    console.error('Error analyzing sentiment:', error.message);
    res.status(500).json({ error: 'Internal server error during sentiment analysis' });
  }
});

module.exports = router;
