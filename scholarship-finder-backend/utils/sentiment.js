const vader = require('vader-sentiment');

/**
 * Analyzes the sentiment of a given text using VADER
 * @param {string} text
 * @returns {{ sentimentScores: object, classification: string, compoundScore: number }}
 */
function analyzeSentiment(text) {
  if (!text) throw new Error('Text is required for sentiment analysis');

  const sentiment = vader.SentimentIntensityAnalyzer.polarity_scores(text);
  const compound = sentiment.compound;

  let classification = 'neutral';
  if (compound >= 0.05) classification = 'positive';
  else if (compound <= -0.05) classification = 'negative';

  return {
    sentimentScores: sentiment,
    classification,
    compoundScore: compound,
  };
}

module.exports = { analyzeSentiment };
