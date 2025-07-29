const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide a company name'],
        maxlength: 50,
    },
    position: {
        type: String,
        required: [true, 'Please provide a position'],
        maxlength: 100,
    },
    status: {
        type: String,
        enum: ['Interviewing', 'Declined', 'Pending', 'Offer', 'Wishlist', 'Applied', 'Rejected'],
        default: 'Wishlist',
    },
    // ... other fields remain the same ...
    jobDescription: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    },
    dateApplied: {
        type: Date
    },
    // ADD THIS FIELD:
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: [true, 'Please provide a user'],
    },
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
