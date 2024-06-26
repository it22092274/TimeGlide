const mongoose = require('mongoose');

// Define the Pomodoro schema
const pomodoroSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true // Ensure uid is unique
    },
    date: {
        type: Date, // Use Date type for better date handling
        required: true
    },
    totalTime: {
        type: Number, // Use Number type to represent time in hours
        required: true
    },
    totalBreak: {
        type: Number, // Use Number type to represent break time in hours
        required: true
    }
});

// Create the Pomodoro model using the schema
const Pomodoro = mongoose.model('Pomodoro', pomodoroSchema);

// Export the Pomodoro model for use in other parts of the application
module.exports = Pomodoro;
