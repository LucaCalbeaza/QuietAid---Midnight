const { expressjwt: expressJWT } = require('express-jwt');

const isAuth = expressJWT({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'auth',
  getToken: (req) => req.cookies?.token,
});

module.exports = (req, res, next) => {
  console.log('🍪 Cookies received:', req.cookies);
  
  isAuth(req, res, (err) => {
    if (err) {
      console.log('Auth error:', err);
      return res.status(401).json({ message: 'Invalid or missing token' });
    }
    console.log('Auth success, req.auth:', req.auth);
    next();
  });
};