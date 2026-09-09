const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const { connectDB, getIsConnected } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const offlineFallback = require('./middlewares/offlineFallback');

dotenv.config();

// Initialize app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Security Middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(hpp());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS Configuration - Permissive for local development
const allowedOrigins = [
    process.env.initURL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, true); // Do not block development origins
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: '36 Montane Backend API',
        port,
        dbConnected: getIsConnected(),
        timestamp: new Date().toISOString()
    });
});

// Connect to MongoDB
connectDB();

// Offline fallback middleware (activates when MongoDB is not connected)
app.use('/api', offlineFallback);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 36 Montane API server running on port ${port}`);
    console.log(`📡 Healthcheck: http://localhost:${port}/api/health`);
});

