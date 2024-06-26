const mongoose = require('mongoose');

// Define the Task schema
const subtaskSchema = new mongoose.Schema({
    mtid: {
        type: String,
        required: true
    },
    stid: {
        type: String,
        required: true
    },
    bid: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    startdate: {
        type: Date, // Use Date type for startdate
    },
    expiredate: {
        type: Date, // Use Date type for expiredate
    },
    tags: {
        type: [String], // Specify the type of elements in the array
    }
}, {
    timestamps: true // Add createdAt and updatedAt fields
});

// Create the Task model using the schema
const Subtask = mongoose.model('Task', subtaskSchema);

// Export the Task model for use in other parts of the application
module.exports = Subtask;
