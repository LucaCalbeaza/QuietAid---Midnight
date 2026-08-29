const { expressjwt: expressJWT } = require('express-jwt');

const isAuth = expressJWT({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'auth',
  getToken: (req) => req.cookies?.token,
});

module.exports = (req, res, next) => {
  isAuth(req, res, (err) => {
    if (err) {
      // Expected when the frontend probes /users/me before login — keep logs quiet
      if (err.code !== 'credentials_required') {
        console.log('Auth error:', err.message);
      }
      return res.status(401).json({ message: 'Invalid or missing token' });
    }
    next();
  });
};