const mongoose = require('mongoose');

// Define the Task schema
const taskSchema = new mongoose.Schema({
    tid: {
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
const Task = mongoose.model('Task', taskSchema);

// Export the Task model for use in other parts of the application
module.exports = Task;
