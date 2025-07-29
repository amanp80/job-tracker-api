
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
    // Add your Vercel URL here. Example below.
    'https://job-tracker-frontend-alpha.vercel.app' 
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
};

// --- Middleware ---
// This is the most important part: Use the CORS options.
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
