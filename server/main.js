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

        // Allow all Vercel deployments (*.vercel.app)
        if (/^https?:\/\/([a-z0-9-]+)\.vercel\.app$/i.test(origin)) {
            return callback(null, true);
        }

        // Allow all Render deployments (*.onrender.com)
        if (/^https?:\/\/([a-z0-9-]+)\.onrender\.com$/i.test(origin)) {
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

