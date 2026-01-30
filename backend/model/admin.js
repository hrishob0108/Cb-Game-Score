const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    teamName: {
        type : String,
        required : true
    },
    squidScore: {
        type : Number,
        required : true
    }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);