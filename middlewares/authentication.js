const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = {}; 
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign(
        { userId: user.id }, 
        test.env.JWT_SECRET, 
        { expiresIn: '1h' } 
      );

      res.json({ token });
    } else {
      res.status(401).json({ message: 'Authentification échouée' });
    }
  } catch (error) {
 
    res.status(500).json({ message: 'Erreur serveur' });
  }
};