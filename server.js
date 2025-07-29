// server.js

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
// IMPORTANT: This is the new section to allow your frontend to connect.
const allowedOrigins = [
    'http://localhost:3000',
    'https://job-tracker-frontend-lilac-two.vercel.app/',
 // Your local frontend for testing
    // Add your deployed Vercel URL here. Example:
    // 'https://job-tracker-frontend-xxxx.vercel.app' 
];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

// --- Middleware ---
app.use(cors(corsOptions)); // Use the new CORS options
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
