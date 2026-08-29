const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const User = require('../models/user');
const Scholarship = require('../models/Scholarship');
const PrivateApplication = require('../models/PrivateApplication');
const {
  allocatePublicApplicationId,
  generatePseudonym,
  toProviderDto,
  toStudentDto,
  assertNoSensitiveKeys,
} = require('../utils/privateApplicationHelpers');

const ALLOWED_DISCLOSURE_FIELDS = ['name', 'email', 'address', 'phone'];

/**
 * Create pseudonymous application — only after client reports successful Midnight proof.
 * Does NOT accept or store private eligibility attributes.
 */
router.post('/', isAuth, requireRole('student'), async (req, res) => {
  try {
    const { scholarshipId, midnight, eligibilityVerified } = req.body || {};

    if (!scholarshipId) {
      return res.status(400).json({ error: 'scholarshipId is required' });
    }
    if (!eligibilityVerified || !midnight || midnight.proofStatus !== 'VALID') {
      return res.status(400).json({
        error:
          'Application rejected: Midnight eligibility verification did not succeed',
      });
    }

    // Reject any attempt to persist private eligibility fields
    const forbidden = [
      'income',
      'incomeBand',
      'GPA',
      'gpa',
      'enrollment',
      'disability',
      'firstGeneration',
      'housingInsecurity',
      'householdIncome',
      'credential',
      'credentialClaims',
      'credentialSecret',
      'credentialSalt',
    ];
    for (const key of forbidden) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        return res.status(400).json({
          error: 'Private eligibility attributes must not be submitted',
        });
      }
    }

    const scholarship = await Scholarship.findById(scholarshipId);
    if (!scholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }

    const publicApplicationId = await allocatePublicApplicationId();
    const pseudonym = generatePseudonym();

    const app = await PrivateApplication.create({
      publicApplicationId,
      studentId: req.auth.userId,
      scholarshipId: scholarship._id,
      scholarshipTitle: scholarship.title,
      pseudonym,
      midnight: {
        network: midnight.network || '',
        contractId: midnight.contractId || '',
        contractAddress: midnight.contractAddress || '',
        transactionId: midnight.transactionId || '',
        executionId: midnight.executionId || '',
        proofStatus: midnight.proofStatus,
        ruleVersion: midnight.ruleVersion || 0,
        verifiedCount: midnight.verifiedCount || 0,
      },
      eligibilityVerified: true,
      applicationStatus: 'submitted',
      identityDisclosure: {
        status: 'HIDDEN',
        requestedFields: [],
        approvedFields: [],
      },
    });

    return res.status(201).json(toStudentDto(app));
  } catch (err) {
    console.error('Create private application error:', err.message);
    return res.status(500).json({ error: 'Failed to create application' });
  }
});

router.get('/me', isAuth, requireRole('student'), async (req, res) => {
  try {
    const apps = await PrivateApplication.find({
      studentId: req.auth.userId,
    }).sort({ createdAt: -1 });
    return res.json(apps.map(toStudentDto));
  } catch (err) {
    return res.status(500).json({ error: 'Failed to list applications' });
  }
});

router.get(
  '/:publicApplicationId',
  isAuth,
  async (req, res) => {
    try {
      const app = await PrivateApplication.findOne({
        publicApplicationId: req.params.publicApplicationId,
      });
      if (!app) return res.status(404).json({ error: 'Not found' });

      const user = await User.findById(req.auth.userId).select('role');
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      if (user.role === 'provider') {
        const dto = toProviderDto(app);
        assertNoSensitiveKeys(dto);
        return res.json(dto);
      }

      if (String(app.studentId) !== String(req.auth.userId)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      return res.json(toStudentDto(app));
    } catch (err) {
      return res.status(500).json({ error: 'Failed to load application' });
    }
  }
);

/**
 * Student selective disclosure — only approved contact fields become provider-visible.
 */
router.post(
  '/:publicApplicationId/disclose',
  isAuth,
  requireRole('student'),
  async (req, res) => {
    try {
      const app = await PrivateApplication.findOne({
        publicApplicationId: req.params.publicApplicationId,
        studentId: req.auth.userId,
      });
      if (!app) return res.status(404).json({ error: 'Not found' });

      if (
        app.identityDisclosure.status !== 'REQUESTED' &&
        app.identityDisclosure.status !== 'PARTIALLY_DISCLOSED'
      ) {
        return res.status(400).json({
          error: 'No pending disclosure request from the provider',
        });
      }

      const fields = Array.isArray(req.body?.fields) ? req.body.fields : [];
      const approved = fields.filter((f) =>
        ALLOWED_DISCLOSURE_FIELDS.includes(f)
      );
      if (approved.length === 0) {
        return res.status(400).json({ error: 'Select at least one field' });
      }

      const user = await User.findById(req.auth.userId);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const disclosed = {};
      if (approved.includes('name')) {
        disclosed.name = `${user.firstName} ${user.lastName}`.trim();
      }
      if (approved.includes('email')) {
        disclosed.email = user.email;
      }
      if (approved.includes('address')) {
        const loc = user.location || {};
        disclosed.address = [loc.city, loc.state, loc.country]
          .filter(Boolean)
          .join(', ');
      }
      if (approved.includes('phone')) {
        disclosed.phone = req.body.phone || '';
      }

      app.identityDisclosure.approvedFields = approved;
      app.identityDisclosure.disclosed = disclosed;
      app.identityDisclosure.disclosedAt = new Date();
      app.identityDisclosure.status =
        approved.length >= (app.identityDisclosure.requestedFields || []).length
          ? 'DISCLOSED'
          : 'PARTIALLY_DISCLOSED';
      app.applicationStatus = 'advanced';
      await app.save();

      return res.json(toStudentDto(app));
    } catch (err) {
      console.error('Disclose error:', err.message);
      return res.status(500).json({ error: 'Disclosure failed' });
    }
  }
);

module.exports = router;
