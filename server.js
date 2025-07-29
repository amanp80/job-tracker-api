require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// --- Import Routers ---
const authRouter = require('./routes/authRoutes');
const jobsRouter = require('./routes/jobsRoutes');

// --- Import Middleware ---
const authenticateUser = require('./middleware/authentication');

// --- Express App Initialization ---
const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.get('/', (req, res) => {
    res.send('Welcome to the Job Tracker API!');
});

// Authentication routes (open to public)
app.use('/api/v1/auth', authRouter);
// Jobs routes (protected by authentication middleware)
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

// --- Start the Application ---
start();
