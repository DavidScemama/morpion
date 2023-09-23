const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authentification requise' });
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, test.env.JWT_SECRET); 
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentification échouée' });
  }
};