const jwt = require('jsonwebtoken');

// Secret for JWT
const JWT_SECRET = 'OW-SECRET';

// Function to authenticate token
function authenticateToken(req, res, next) {
    // Get token from headers
    const token = req.headers['authorization'];
    // Check if token is not null
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    // Verify token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken };
