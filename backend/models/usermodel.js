const mongoose = require('mongoose');

// Define a schema for the User model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // This field is required
    },
    email: {
        type: String,
        required: true, // This field is required
        unique: true // Ensure email is unique in the collection
    },
    password: {
        type: String,
        required: true, // This field is required
    }
});

// Create a model using the schema
const User = mongoose.model('User', userSchema);

// Export the model for use in other parts of the application
module.exports = User;
