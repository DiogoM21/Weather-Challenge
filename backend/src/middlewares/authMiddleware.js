const jwt = require('jsonwebtoken');

// Secret for JWT
const JWT_SECRET = 'OW-SECRET';

// Function to authenticate token
function authenticateToken(req, res, next) {
    const lang = req.query.lang || 'en';
    // Get token from headers
    const token = req.headers['authorization'];
    // Check if token is not null
    if (!token) {
        return res.status(401).json({ message: lang === 'pt' ? 'Não autorizado!' : 'Unauthorized!' });
    }
    // Verify token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: lang === 'pt' ? 'Token inválido!' : 'Invalid token!' });
        }
        if (req.body.email && req.body.email !== user.email) {
            return res.status(403).json({ message: lang === 'pt' ? 'Não autorizado!' : 'Unauthorized!' });
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
