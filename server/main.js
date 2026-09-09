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

// Middleware & Payload Size Limits (DoS Prevention)
app.use(bodyParser.json({ limit: '100kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100kb' }));

// Security Headers
app.disable('x-powered-by');
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
}));
app.use(xss());
app.use(mongoSanitize());
app.use(hpp());

// General Rate Limiting (Allows healthy browsing on shared networks while blocking DDoS)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again later.' },
});
app.use(generalLimiter);

// Specialized Auth Brute-Force Rate Limiter
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.' },
});

// Specialized Form Spam Rate Limiter
const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Submission limit reached from this IP. Please wait a few minutes before trying again.' },
});

// CORS Configuration - Supports Local, Vercel Deployments, and Custom Production Domains
const configuredOrigins = [
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    process.env.initURL,
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : []),
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);

        // Allow explicitly configured origins
        if (configuredOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Allow official 36 Montane Vercel deployments & preview branches
        if (/^https?:\/\/(36-?montane[a-z0-9-]*|init[a-z0-9-]*|three6montane[a-z0-9-]*)\.vercel\.app$/i.test(origin)) {
            return callback(null, true);
        }

        // Allow official 36 Montane Render deployments
        if (/^https?:\/\/(36-?montane[a-z0-9-]*|three6montane[a-z0-9-]*)\.onrender\.com$/i.test(origin)) {
            return callback(null, true);
        }

        // Fallback for development environments
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }

        return callback(new Error(`Origin ${origin} not allowed by CORS`));
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
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/contact', formLimiter);
app.use('/api/booking', formLimiter);
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ message: 'Request payload too large. Maximum size is 100kb.' });
    }
    if (err.message && err.message.includes('CORS')) {
        return res.status(403).json({ message: err.message });
    }
    console.error('Server error:', err.stack || err.message);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 36 Montane API server running on port ${port}`);
    console.log(`📡 Healthcheck: http://localhost:${port}/api/health`);
});

