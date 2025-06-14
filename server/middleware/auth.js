const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user info to request
        req.user = decoded;

        next();
    } catch (error) {
        console.error(error);

        if(error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired, LOGIN AGAIN' });

        }
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;