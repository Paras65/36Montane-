const mongoose = require('mongoose');

let isConnected = false;

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
