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

// --- CORS Configuration ---
// This is the critical new section.
const allowedOrigins = [
    'http://localhost:3000', // For local testing
    // Add your Vercel URL here. This has been updated with your latest URL.
    'https://job-tracker-frontend-4dtrcgp8l-amans-projects-5b00666a.vercel.app' 
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Explicitly allow methods
    credentials: true,
};

// --- Middleware ---
// This is the most important part: Use the new CORS options.
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