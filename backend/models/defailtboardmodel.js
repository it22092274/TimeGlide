const mongoose = require('mongoose');

const defboardSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true 
    },
    themeid: {
        type: String,
        default: 'null'
    },
    name: {
        type: String,
        required: true, 
        default: "default",
    },
    description: {
        type: String, 
    },
    startdate: {
        type: String,
    },
    expiredate: {
        type: String, 
    },
    displaycolor: {
        type: String, 
    }
});

const Defaultboard = mongoose.model('Defaultboard', defboardSchema);

module.exports = Defaultboard;
