const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// MongoDB connection URI from environment variables
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoURI)
.then(() => {
    console.log('Database connection successful');
})
.catch((err) => {
    console.error('Database connection error:', err);
});
