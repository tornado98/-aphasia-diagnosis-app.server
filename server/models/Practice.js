const mongoose = require('mongoose');


const practiceSchema = new mongoose.Schema({
    categoryname: {
        type: String,
        required: true,
    },
    content: {
        type: Array,
        required: true,
    }




})

module.exports = mongoose.model('Practice', practiceSchema);