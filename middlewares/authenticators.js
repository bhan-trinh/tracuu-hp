const jwt = require('jsonwebtoken') 
const publicPaths = require('../routes/public/routes')

exports.authenticateRequest = async(req, res, next) => {
  if (publicPaths.paths.includes(req.path)) {
      console.log('skipped!')
      next(); // Skip auth
  }
    const authHeader = req.headers.authorization
    const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded.data;
    next();
  } catch (err) {
    res.status(403).send('Invalid token');
  }
}