const mongoose = require('mongoose');

let isConnected = false;

const ensureAdminUser = async () => {
    try {
        const User = require('../models/User');
        const bcrypt = require('bcryptjs');
        const defaultAdminUser = process.env.ADMIN_USERNAME || 'admin';
        const defaultAdminPass = process.env.ADMIN_PASSWORD || 'admin123';

        // Ensure configured admin user exists
        const primaryAdmin = await User.findOne({
            $or: [{ username: defaultAdminUser }, { email: `${defaultAdminUser}@36montane.com` }]
        });
        if (!primaryAdmin) {
            const hash = await bcrypt.hash(defaultAdminPass, 10);
            await User.create({
                username: defaultAdminUser,
                email: `${defaultAdminUser}@36montane.com`,
                password: hash,
                name: defaultAdminUser === 'admin' ? 'Administrator' : defaultAdminUser,
                role: 'admin'
            });
            console.log(`✅ [MONGODB] Initialized primary admin account: ${defaultAdminUser}`);
        }

        // Also ensure demo admin ('admin') exists if defaultAdminUser is different
        if (defaultAdminUser !== 'admin') {
            const demoAdmin = await User.findOne({
                $or: [{ username: 'admin' }, { email: 'admin@36montane.com' }]
            });
            if (!demoAdmin) {
                const hash = await bcrypt.hash('admin123', 10);
                await User.create({
                    username: 'admin',
                    email: 'admin@36montane.com',
                    password: hash,
                    name: 'Administrator',
                    role: 'admin'
                });
                console.log('✅ [MONGODB] Initialized demo admin account (admin / admin123)');
            }
        }
    } catch (err) {
        console.warn('⚠️  [MONGODB] Admin initialization warning:', err.message);
    }
};

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.warn('⚠️  [MONGODB] No MONGODB_URI found in environment. Running in offline/mock fallback mode.');
        isConnected = false;
        return false;
    }

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 4000,
        });
        isConnected = true;
        console.log('✅ [MONGODB] Connected successfully to database');
        await ensureAdminUser();
        return true;
    } catch (error) {
        isConnected = false;
        console.warn('⚠️  [MONGODB] Database connection failed:', error.message);
        console.warn('ℹ️  [MONGODB] Backend will continue running in offline/mock fallback mode.');
        return false;
    }
};

const getIsConnected = () => isConnected || mongoose.connection.readyState === 1;

module.exports = { connectDB, getIsConnected };
