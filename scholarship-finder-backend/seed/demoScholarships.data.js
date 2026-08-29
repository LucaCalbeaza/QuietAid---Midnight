/**
 * QuietAid demo seed data.
 *
 * SIX fictional U.S. scholarships used to demo QuietAid without depending on the
 * ScholarshipsInIndia scraper. Every entry is invented — there are no real
 * providers, URLs, award amounts, or students represented here.
 *
 * Between them the six entries exercise all seven private eligibility
 * categories QuietAid cares about:
 *
 *   household income      -> entries 1, 4
 *   U.S. state            -> entries 2, 4
 *   enrollment status     -> entries 3, 5
 *   GPA                   -> entries 4, 5
 *   first-generation      -> entries 1, 6
 *   disability            -> entries 2, 6
 *   housing insecurity    -> entries 3, 6
 *
 * `source` is intentionally shared so the seed script can find and update its
 * own records on re-run without touching scraped data.
 */

const DEMO_SOURCE = 'QuietAid Demo Seed';
const DEMO_DISCLAIMER =
  'FICTIONAL DEMO DATA — created for the QuietAid Midnight hackathon demo. ' +
  'This scholarship, its provider, amount, deadline, and URLs are invented and ' +
  'do not represent a real program. No real student information is stored.';

/** Prefix every description so the UI shows the disclaimer even without new fields. */
const demoDescription = (text) => `[FICTIONAL DEMO DATA] ${text}`;

const scholarships = [
  {
    title: 'Horizon First-Gen Futures Grant',
    provider: 'Horizon Futures Foundation (fictional)',
    description: demoDescription(
      'Supports first-generation college students from lower-income households ' +
        'as they begin an undergraduate degree. Awarded on financial need.'
    ),
    amount: '$5,000',
    deadline: '2026-03-15',
    awardType: 'need',
    link: 'https://quietaid.demo/scholarships/horizon-first-gen-futures-grant',
    applyLink:
      'https://quietaid.demo/scholarships/horizon-first-gen-futures-grant/apply',
    educationLevel: 'undergraduate',
    country: 'United States',
    eligibility:
      'First-generation undergraduates; household income at or below $60,000.',
    publicRequirements: [
      'Enrolled or accepted in an accredited U.S. undergraduate program',
      'Submit a 500-word personal statement',
      'One letter of recommendation',
    ],
    privateEligibility: {
      maxHouseholdIncome: 60000,
      eligibleStates: [],
      enrollmentStatus: 'any',
      minGPA: null,
      requiresFirstGeneration: true,
      requiresDisability: false,
      requiresHousingInsecurity: false,
    },
  },

  {
    title: 'Golden State Access Scholarship',
    provider: 'California Access Alliance (fictional)',
    description: demoDescription(
      'For California students with a documented disability who are pursuing ' +
        'higher education. Funds tuition, assistive technology, or access services.'
    ),
    amount: '$7,500',
    deadline: '2026-04-01',
    awardType: 'mixed',
    link: 'https://quietaid.demo/scholarships/golden-state-access-scholarship',
    applyLink:
      'https://quietaid.demo/scholarships/golden-state-access-scholarship/apply',
    educationLevel: 'undergraduate',
    country: 'United States',
    state: 'California',
    eligibility:
      'California residents with a documented disability enrolled in a degree program.',
    publicRequirements: [
      'California resident',
      'Enrolled at a California college or university',
      'Documentation of disability from a qualified professional',
    ],
    privateEligibility: {
      maxHouseholdIncome: null,
      eligibleStates: ['California'],
      enrollmentStatus: 'any',
      minGPA: null,
      requiresFirstGeneration: false,
      requiresDisability: true,
      requiresHousingInsecurity: false,
    },
  },

  {
    title: 'SteadyHome Student Stability Award',
    provider: 'SteadyHome Trust (fictional)',
    description: demoDescription(
      'Helps students experiencing housing insecurity stay enrolled. Part-time ' +
        'students are eligible. Funds may be used for rent, transport, or fees.'
    ),
    amount: '$3,000',
    deadline: '2026-02-28',
    awardType: 'need',
    link: 'https://quietaid.demo/scholarships/steadyhome-student-stability-award',
    applyLink:
      'https://quietaid.demo/scholarships/steadyhome-student-stability-award/apply',
    educationLevel: 'open',
    country: 'United States',
    eligibility:
      'Students experiencing housing insecurity; part-time or full-time enrollment accepted.',
    publicRequirements: [
      'Currently enrolled at an accredited U.S. institution (any credit load)',
      'Short statement describing your current housing situation',
      'Enrollment verification from your registrar',
    ],
    privateEligibility: {
      maxHouseholdIncome: null,
      eligibleStates: [],
      enrollmentStatus: 'any',
      minGPA: null,
      requiresFirstGeneration: false,
      requiresDisability: false,
      requiresHousingInsecurity: true,
    },
  },

  {
    title: 'Lone Star Merit & Need Award',
    provider: 'Texas Opportunity Scholars (fictional)',
    description: demoDescription(
      'For Texas undergraduates who combine strong academics with financial ' +
        'need. Renewable for up to four years.'
    ),
    amount: '$6,000',
    deadline: '2026-05-01',
    awardType: 'mixed',
    link: 'https://quietaid.demo/scholarships/lone-star-merit-and-need-award',
    applyLink:
      'https://quietaid.demo/scholarships/lone-star-merit-and-need-award/apply',
    educationLevel: 'undergraduate',
    country: 'United States',
    state: 'Texas',
    minGPA: 3.2,
    maxIncome: 80000,
    eligibility:
      'Texas residents; minimum 3.2 GPA; household income at or below $80,000.',
    publicRequirements: [
      'Texas resident enrolled at a Texas college or university',
      'Official transcript',
      'Two academic references',
    ],
    privateEligibility: {
      maxHouseholdIncome: 80000,
      eligibleStates: ['Texas'],
      enrollmentStatus: 'any',
      minGPA: 3.2,
      requiresFirstGeneration: false,
      requiresDisability: false,
      requiresHousingInsecurity: false,
    },
  },

  {
    title: 'Evergreen Full-Time Scholars Fund',
    provider: 'Evergreen Education Fund (fictional)',
    description: demoDescription(
      'A merit award for full-time undergraduates maintaining a strong GPA. ' +
        'Recognises consistent academic achievement.'
    ),
    amount: '$4,500',
    deadline: '2026-03-31',
    awardType: 'merit',
    link: 'https://quietaid.demo/scholarships/evergreen-full-time-scholars-fund',
    applyLink:
      'https://quietaid.demo/scholarships/evergreen-full-time-scholars-fund/apply',
    educationLevel: 'undergraduate',
    country: 'United States',
    minGPA: 3.5,
    eligibility:
      'Full-time undergraduates with a cumulative GPA of 3.5 or higher; ' +
      'household income at or below $75,000 for Midnight V1 private verification.',
    publicRequirements: [
      'Full-time enrollment (12+ credit hours) at an accredited U.S. institution',
      'Household income at or below $75,000 (proven privately via Midnight)',
      'Official transcript showing cumulative GPA',
      'Personal essay on an academic project you are proud of',
    ],
    midnightEnabled: true,
    midnightRuleVersion: 1,
    privateEligibility: {
      maxHouseholdIncome: 75000,
      eligibleStates: [],
      enrollmentStatus: 'fullTime',
      minGPA: 3.5,
      requiresFirstGeneration: false,
      requiresDisability: false,
      requiresHousingInsecurity: false,
    },
  },

  {
    title: 'New Roots Opportunity Scholarship',
    provider: 'New Roots Community Fund (fictional)',
    description: demoDescription(
      'A wrap-around award for students facing several barriers at once: ' +
        'first-generation students who also have a disability or are ' +
        'experiencing housing insecurity.'
    ),
    amount: '$8,000',
    deadline: '2026-04-30',
    awardType: 'need',
    link: 'https://quietaid.demo/scholarships/new-roots-opportunity-scholarship',
    applyLink:
      'https://quietaid.demo/scholarships/new-roots-opportunity-scholarship/apply',
    educationLevel: 'open',
    country: 'United States',
    eligibility:
      'First-generation students who also have a documented disability and/or ' +
      'are experiencing housing insecurity.',
    publicRequirements: [
      'Enrolled or accepted at an accredited U.S. institution',
      'Personal statement describing your circumstances and goals',
      'Supporting documentation for at least one qualifying circumstance',
    ],
    privateEligibility: {
      maxHouseholdIncome: null,
      eligibleStates: [],
      enrollmentStatus: 'any',
      minGPA: null,
      requiresFirstGeneration: true,
      requiresDisability: true,
      requiresHousingInsecurity: true,
    },
  },
];

module.exports = { DEMO_SOURCE, DEMO_DISCLAIMER, scholarships };
