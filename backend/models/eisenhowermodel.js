const mongoose = require('mongoose');

// Define the Eisenhower Task schema
const eisenhowerSchema = new mongoose.Schema({
    tid: {
        type: String,
        required: true,
        unique: true // Ensure tid is unique
    },
    type: {
        type: String,
        required: true,
        enum: ['Do', 'Decide', 'Delegate', 'Delete'] // Define allowed values for type
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the Eisenhower model using the schema
const EisenhowerTask = mongoose.model('EisenhowerTask', eisenhowerSchema);

// Export the Eisenhower model for use in other parts of the application
module.exports = EisenhowerTask;
