const mongoose = require('mongoose');

// Define the Reminder schema
const reminderSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true // Ensure uid is unique
    },
    date: {
        type: Date, // Use Date type for better date handling
        required: true
    },
    time: {
        type: String, // Default value should be a string
        default: '12:00 PM' // Default value for time
    },
    tid: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    count: {
        type: Number,
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the Reminder model using the schema
const Reminder = mongoose.model('Reminder', reminderSchema);

// Export the Reminder model for use in other parts of the application
module.exports = Reminder;
