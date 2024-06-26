const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true 
    },
    name: {
        type: String,
        required: true, 
        unique: true
    },
    description: {
        type: String, 
    },
    startdate: {
        type: String,
    },
    expiredate: {
        type: String, 
    }
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
