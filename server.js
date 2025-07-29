require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// --- Import Routes ---
const authRouter = require('./routes/authRoutes');
const jobsRouter = require('./routes/jobsRoutes');

// --- Import Middleware ---
const authenticateUser = require('./middleware/authentication');

// --- Express App Initialization ---
const app = express();
const PORT = process.env.PORT || 5001;

// --- Definitive CORS Configuration ---
const corsOptions = {
    origin: (origin, callback) => {
        // The 'origin' is the URL of the frontend making the request (e.g., your Vercel URL)

        // Allow requests with no origin (like Postman or mobile apps)
        if (!origin) {
            return callback(null, true);
        }

        // Allow your local frontend and ANY Vercel deployment URL to connect
        if (origin === 'http://localhost:3000' || new URL(origin).hostname.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

// --- Middleware ---
// IMPORTANT: Handle preflight requests across all routes before other middleware
app.options('*', cors(corsOptions));

// Use the CORS options for all other requests
app.use(cors(corsOptions));

app.use(express.json());

// --- API Routes ---
app.get('/', (req, res) => {
    res.send('Welcome to the Job Tracker API!');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);


// --- Database Connection and Server Startup ---
const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB successfully!');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
};

start();