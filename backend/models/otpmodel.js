const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 180 // TTL index in seconds (180 seconds = 3 minutes)
    }
});

const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth;
