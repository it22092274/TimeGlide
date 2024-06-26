const mongoose = require('mongoose');

// Define the Tag schema
const tagSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true,
        unique: true
    },
    color: {
        type: String, 
        default: '#AD0000'
    }
});

// Create the Tag model using the schema
const Tag = mongoose.model('Tag', tagSchema);

// Export the Tag model for use in other parts of the application
module.exports = Tag;
