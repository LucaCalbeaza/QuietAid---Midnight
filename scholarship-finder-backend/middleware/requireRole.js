const User = require('../models/user');

/**
 * Require authenticated user to have one of the given roles.
 * Usage: requireRole('provider') or requireRole('student', 'provider')
 */
function requireRole(...roles) {
  return async (req, res, next) => {
    try {
      if (!req.auth?.userId) {
        return res.status(401).json({ message: 'Invalid or missing token' });
      }
      const user = await User.findById(req.auth.userId).select('role');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      const role = user.role || 'student';
      if (!roles.includes(role)) {
        return res.status(403).json({ error: 'Forbidden for this role' });
      }
      req.userRole = role;
      return next();
    } catch (err) {
      return res.status(500).json({ error: 'Authorization failed' });
    }
  };
}

module.exports = requireRole;
