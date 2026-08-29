const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const PrivateApplication = require('../models/PrivateApplication');
const {
  toProviderDto,
  assertNoSensitiveKeys,
} = require('../utils/privateApplicationHelpers');

router.get(
  '/applications',
  isAuth,
  requireRole('provider'),
  async (req, res) => {
    try {
      const apps = await PrivateApplication.find({
        eligibilityVerified: true,
      }).sort({ createdAt: -1 });
      const dtos = apps.map((a) => {
        const dto = toProviderDto(a);
        assertNoSensitiveKeys(dto);
        return dto;
      });
      return res.json(dtos);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to list applications' });
    }
  }
);

router.get(
  '/applications/:publicApplicationId',
  isAuth,
  requireRole('provider'),
  async (req, res) => {
    try {
      const app = await PrivateApplication.findOne({
        publicApplicationId: req.params.publicApplicationId,
      });
      if (!app) return res.status(404).json({ error: 'Not found' });
      const dto = toProviderDto(app);
      assertNoSensitiveKeys(dto);
      return res.json(dto);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to load application' });
    }
  }
);

router.post(
  '/applications/:publicApplicationId/request-disclosure',
  isAuth,
  requireRole('provider'),
  async (req, res) => {
    try {
      const app = await PrivateApplication.findOne({
        publicApplicationId: req.params.publicApplicationId,
      });
      if (!app) return res.status(404).json({ error: 'Not found' });

      const fields = Array.isArray(req.body?.fields)
        ? req.body.fields
        : ['name', 'email'];
      const allowed = fields.filter((f) =>
        ['name', 'email', 'address', 'phone'].includes(f)
      );

      app.identityDisclosure.status = 'REQUESTED';
      app.identityDisclosure.requestedFields = allowed;
      app.applicationStatus = 'under_review';
      await app.save();

      const dto = toProviderDto(app);
      assertNoSensitiveKeys(dto);
      return res.json(dto);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to request disclosure' });
    }
  }
);

module.exports = router;
