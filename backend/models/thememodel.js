const mongoose = require('mongoose');

// Define the Theme schema
const themeSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true, // Assuming the link is required
    },
    color: {
        type: String,
        required: true, // Assuming the color is required
        default: '#FFFFFF' // Optional: Provide a default color
    }
});

// Create the Theme model using the schema
const Theme = mongoose.model('Theme', themeSchema);

// Export the Theme model for use in other parts of the application
module.exports = Theme;
