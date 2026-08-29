const mongoose = require('mongoose');

const privateApplicationSchema = new mongoose.Schema(
  {
    publicApplicationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    /** Internal only — never returned on provider APIs */
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    scholarshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scholarship',
      required: true,
    },
    scholarshipTitle: { type: String, default: '' },
    pseudonym: { type: String, required: true },
    midnight: {
      network: { type: String, default: '' },
      contractId: { type: String, default: '' },
      contractAddress: { type: String, default: '' },
      transactionId: { type: String, default: '' },
      executionId: { type: String, default: '' },
      proofStatus: { type: String, default: 'UNKNOWN' },
      ruleVersion: { type: Number, default: 0 },
      verifiedCount: { type: Number, default: 0 },
    },
    eligibilityVerified: { type: Boolean, default: false },
    applicationStatus: {
      type: String,
      enum: ['submitted', 'under_review', 'advanced', 'closed'],
      default: 'submitted',
    },
    identityDisclosure: {
      status: {
        type: String,
        enum: ['HIDDEN', 'REQUESTED', 'PARTIALLY_DISCLOSED', 'DISCLOSED'],
        default: 'HIDDEN',
      },
      requestedFields: { type: [String], default: [] },
      approvedFields: { type: [String], default: [] },
      disclosedAt: { type: Date, default: null },
      // Only populated fields that student approved — never income/GPA/etc.
      disclosed: {
        name: { type: String, default: undefined },
        email: { type: String, default: undefined },
        address: { type: String, default: undefined },
        phone: { type: String, default: undefined },
      },
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.PrivateApplication ||
  mongoose.model('PrivateApplication', privateApplicationSchema);
