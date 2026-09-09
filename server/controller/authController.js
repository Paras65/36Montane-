const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getJwtSecret = () => process.env.JWT_SECRET || '36montane_super_secret_jwt_key_2026';

// Helper function to generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id || user.id, username: user.username, role: user.role || 'admin' },
        getJwtSecret(),
        { expiresIn: '24h' }
    );
};

// Register new user (Protected: first user allowed or requires admin secret/auth)
const register = async (req, res) => {
    const { username, email, password, name, role } = req.body;

    if (!password || (!username && !email)) {
        return res.status(400).json({ message: 'Username/email and password are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            const adminSecret = req.header('x-admin-secret');
            const hasValidSecret = process.env.REGISTRATION_SECRET && adminSecret === process.env.REGISTRATION_SECRET;
            const isAdminUser = req.user && req.user.role === 'admin';

            if (!hasValidSecret && !isAdminUser) {
                return res.status(403).json({ message: 'Registration is restricted. Admin authorization required.' });
            }
        }

        const query = [];
        if (username) query.push({ username: String(username).trim() });
        if (email) query.push({ email: String(email).trim().toLowerCase() });

        const existingUser = await User.findOne({ $or: query });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this username or email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username: username || email.split('@')[0],
            email: email || `${username}@36montane.local`,
            name: name || username || 'Admin User',
            password: hashedPassword,
            role: role || 'admin'
        });

        await user.save();

        const token = generateToken(user);
        res.status(201).json({
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role, name: user.name }
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Login existing user
const login = async (req, res) => {
    const { username, email, password } = req.body;
    const identifier = (username || email || '').trim();

    if (!identifier || !password) {
        return res.status(400).json({ message: 'Please provide username/email and password' });
    }

    const defaultAdminUser = process.env.ADMIN_USERNAME || 'admin';
    const defaultAdminPass = process.env.ADMIN_PASSWORD || 'admin123';

    try {
        // Find user by username or email
        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier.toLowerCase() }]
        });

        // Default admin fallback if credentials match configured admin credentials
        if (!user) {
            if (identifier === defaultAdminUser && password === defaultAdminPass) {
                const dummyAdmin = { id: 'admin-001', username: defaultAdminUser, email: 'admin@36montane.com', role: 'admin', name: 'Administrator' };
                const token = generateToken(dummyAdmin);
                return res.json({ token, user: dummyAdmin });
            }
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role, name: user.name }
        });
    } catch (err) {
        console.error('Login error:', err);
        // Fallback for development if database is unreachable
        if (identifier === defaultAdminUser && password === defaultAdminPass) {
            const dummyAdmin = { id: 'admin-001', username: defaultAdminUser, email: 'admin@36montane.com', role: 'admin', name: 'Administrator' };
            const token = generateToken(dummyAdmin);
            return res.json({ token, user: dummyAdmin });
        }
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Get current authenticated user profile
const getMe = async (req, res) => {
    if (req.user) {
        return res.json({ user: req.user });
    }
    return res.status(401).json({ message: 'Not authenticated' });
};

module.exports = { register, login, getMe };
