const mongoose = require('mongoose');
const { Schema } = mongoose;

const scholarshipSchema = new Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
    applyLink: { type: String, default: '' },
    source: { type: String, required: true },
    description: { type: String, default: '' },
    type: {
      type: String,
      enum: ['scholarship', 'contest', 'competition', 'internship', 'other'],
      required: true,
      default: 'scholarship',
    },
    minGPA: { type: Number, default: 0 },
    educationLevel: {
      type: String,
      enum: [
        'highSchool',
        'undergraduate',
        'graduate',
        'phd',
        'ug_pg',
        'other',
        'open',
      ],
      default: 'open',
    },
    preferredMajor: { type: String, default: '' },
    country: { type: String, default: '' },
    state: { type: String, default: '' },
    maxIncome: { type: Number, default: Infinity },
    genderPreference: {
      type: String,
      enum: ['male', 'female', 'other', 'open'],
      default: 'open',
    },
    castePreference: {
      type: String,
      enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other', 'open'],
      default: 'open',
    },
    ethnicityPreference: { type: String, default: '' },
    requiresStudyAbroad: { type: Boolean, default: false },
    requiresOnlineCourse: { type: Boolean, default: false },
    deadline: { type: String, default: '' },
    awardType: {
      type: String,
      enum: ['merit', 'need', 'mixed', 'other'],
      default: 'other',
    },
    amount: { type: String, default: '' },
    eligibility: { type: String, default: '' },
    sentiment: {
      vader: {
        pos: { type: Number, default: 0 },
        neu: { type: Number, default: 0 },
        neg: { type: Number, default: 0 },
        compound: { type: Number, default: 0 },
      },
      classification: { type: String, default: 'neutral' },
      compoundScore: { type: Number, default: 0 },
    },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Scholarship ||
  mongoose.model('Scholarship', scholarshipSchema);
