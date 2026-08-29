const express = require('express');
const router = express.Router();
const Scholarship = require('../models/Scholarship');
const vader = require('vader-sentiment');

router.get('/', async (req, res) => {
  try {
    const scholarships = await Scholarship.find({ type: 'scholarship' });
    res.json(scholarships);
  } catch (error) {
    console.error('Failed to fetch scholarships:', error);
    res.status(500).json({ error: 'Failed to fetch scholarships' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      title,
      description = '',
      amount = '',
      deadline = '',
      eligibility = '',
      link,
      source,
      minGPA = 0,
      educationLevel = 'other',
      preferredMajor = '',
      country = '',
      state = '',
      maxIncome = Infinity,
      genderPreference = '',
      ethnicityPreference = '',
      requiresStudyAbroad = false,
      requiresOnlineCourse = false,
      awardType = 'other',
      sentiment: incomingSentiment,
    } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (!link) return res.status(400).json({ error: 'Link is required' });
    if (!source) return res.status(400).json({ error: 'Source is required' });

    const sentimentScores = description
      ? vader.SentimentIntensityAnalyzer.polarity_scores(description)
      : null;

    let classification = 'neutral';
    if (sentimentScores) {
      const compound = sentimentScores.compound;
      if (compound >= 0.05) classification = 'positive';
      else if (compound <= -0.05) classification = 'negative';
    }

    const newScholarship = new Scholarship({
      title: title.trim(),
      description: description.trim(),
      amount: amount.trim(),
      deadline: deadline.trim(),
      eligibility: eligibility.trim(),
      link: link.trim(),
      source: source.trim(),
      type: 'scholarship',
      minGPA,
      educationLevel,
      preferredMajor,
      country,
      state,
      maxIncome,
      genderPreference,
      ethnicityPreference,
      requiresStudyAbroad,
      requiresOnlineCourse,
      awardType,
      sentiment: sentimentScores
        ? {
            vader: {
              pos: sentimentScores.pos,
              neu: sentimentScores.neu,
              neg: sentimentScores.neg,
              compound: sentimentScores.compound,
            },
            classification,
            compoundScore: sentimentScores.compound,
          }
        : incomingSentiment,
    });

    const savedScholarship = await newScholarship.save();
    res.status(201).json(savedScholarship);
  } catch (error) {
    console.error('Error creating scholarship:', error);
    res.status(500).json({ error: 'Failed to create scholarship' });
  }
});

module.exports = router;
