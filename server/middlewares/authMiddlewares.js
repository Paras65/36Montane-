const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret && process.env.NODE_ENV === 'production') {
        throw new Error('CRITICAL SECURITY CONFIGURATION: JWT_SECRET environment variable must be set in production!');
    }
    return secret || '36montane_super_secret_jwt_key_2026';
};

const authMiddleware = async (req, res, next) => {
    let token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No authorization token provided' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7).trim();
    }

    try {
        const decoded = jwt.verify(token, getJwtSecret());

        // Support fallback development admin ONLY in non-production development environments
        if (process.env.NODE_ENV !== 'production' && (decoded.id === 'admin-001' || decoded.username === 'admin')) {
            req.user = { id: 'admin-001', username: 'admin', email: 'admin@36montane.com', role: 'admin', name: 'Administrator' };
            return next();
        }

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid or expired' });
    }
};

module.exports = authMiddleware;
