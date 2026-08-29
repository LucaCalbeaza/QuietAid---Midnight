const express = require('express');
const router = express.Router();
const Scholarship = require('../models/Scholarship');
const User = require('../models/user');
const isAuth = require('../middleware/auth');

const indianStates = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu and Kashmir',
  'Ladakh','Puducherry'
].map((s) => s.toLowerCase());

function extractStateFromHeading(heading = '') {
  const h = heading.toLowerCase();
  for (const state of indianStates) {
    if (h.includes(state)) {
      return state.charAt(0).toUpperCase() + state.slice(1);
    }
  }
  return null;
}

function isScholarshipByHeading(heading = '') {
  const h = heading.toLowerCase();
  return (
    h.includes('scholarship') &&
    !h.includes('fellowship') &&
    !h.includes('internship') &&
    !h.includes('competition') &&
    !h.includes('contest') &&
    !h.includes('hackathon') &&
    !h.includes('event')
  );
}

function parseAmount(amountStr = '') {
  if (!amountStr) return 0;
  const digits = amountStr.replace(/[^\d]/g, '');
  const num = parseInt(digits, 10);
  return isNaN(num) ? 0 : num;
}

function calculateMatchingScore(user, s) {
  let score = 0;
  let total = 0;

  if (s.minGPA != null && s.minGPA > 0) {
    total++;
    if (user.GPA != null && user.GPA >= s.minGPA) score++;
  }

  if (s.educationLevel && s.educationLevel !== 'open') {
    total++;
    if (s.educationLevel === 'ug_pg') {
      if (
        user.educationLevel === 'undergraduate' ||
        user.educationLevel === 'graduate'
      ) {
        score++;
      }
    } else if (user.educationLevel === s.educationLevel) {
      score++;
    }
  }

  if (s.country) {
    total++;
    if (user.location?.country === s.country) score++;
  }

  let scholarshipState = null;
  if (s.state) {
    scholarshipState = s.state;
  } else {
    scholarshipState = extractStateFromHeading(s.heading || s.title || '');
  }
  if (scholarshipState) {
    total += 2;
    if (user.location?.state === scholarshipState) {
      score += 2;
    }
  }

  if (s.city) {
    total++;
    if (user.location?.city === s.city) score++;
  }

  if (s.preferredMajor) {
    total++;
    if (user.major && user.major === s.preferredMajor) score++;
  }

  if (
    user.location?.country === 'India' &&
    s.maxIncome != null &&
    s.maxIncome !== Infinity
  ) {
    total++;
    if (user.income != null && user.income <= s.maxIncome) score++;
  }

  if (s.genderPreference && s.genderPreference !== 'open') {
    total++;
    if (user.gender && user.gender === s.genderPreference) score++;
  }

  if (user.location?.country === 'India') {
    if (s.castePreference && s.castePreference !== 'open') {
      total++;
      if (user.casteCategory && user.casteCategory === s.castePreference) {
        score++;
      }
    }
  }

  if (
    s.dateOfBirthRange &&
    s.dateOfBirthRange.from &&
    s.dateOfBirthRange.to
  ) {
    total++;
    if (user.dateOfBirth) {
      const dob = new Date(user.dateOfBirth);
      const from = new Date(s.dateOfBirthRange.from);
      const to = new Date(s.dateOfBirthRange.to);
      if (dob >= from && dob <= to) score++;
    }
  }

  if (total === 0) {
    return 50;
  }
  return Math.round((score / total) * 100);
}

router.get('/', isAuth, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const allEntries = await Scholarship.find();

    const educationFiltered = allEntries.filter((s) => {
      if (!s.educationLevel || s.educationLevel === 'open') {
        return true;
      }
      if (s.educationLevel === 'ug_pg') {
        return (
          user.educationLevel === 'undergraduate' ||
          user.educationLevel === 'graduate'
        );
      }
      return user.educationLevel === s.educationLevel;
    });

    const genderFiltered = educationFiltered.filter((s) => {
      if (!s.genderPreference || s.genderPreference === 'open') {
        return true;
      }
      return user.gender && user.gender === s.genderPreference;
    });

    const casteFiltered = genderFiltered.filter((s) => {
      if (user.location?.country !== 'India') return true;
      if (!s.castePreference || s.castePreference === 'open') return true;
      return user.casteCategory && user.casteCategory === s.castePreference;
    });

    const scholarships = casteFiltered;

    const scored = scholarships.map((s) => {
      const matchPercentage = calculateMatchingScore(user, s);
      const numericAmount = parseAmount(s.amount);
      let deadlineDate = new Date(s.deadline);
      if (isNaN(deadlineDate.getTime())) {
        deadlineDate = new Date('2100-01-01');
      }

      return {
        original: s.toObject(),
        matchPercentage,
        numericAmount,
        deadlineDate,
      };
    });

    const filteredScored = scored.filter((item) => item.matchPercentage >= 50);

    filteredScored.sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      if (a.deadlineDate.getTime() !== b.deadlineDate.getTime()) {
        return a.deadlineDate.getTime() - b.deadlineDate.getTime();
      }
      return b.numericAmount - a.numericAmount;
    });

    const result = filteredScored.map((item) => ({
      ...item.original,
      matchPercentage: item.matchPercentage,
    }));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

module.exports = router;
