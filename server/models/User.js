const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: Number,
        required: true,
        min: 8
    },
    fullName: {
        type: String,
        required: true, 
        min: 5,
        max: 20
    },
    age: {
        type: Number,
        required: true,
        default: ""
    },

    gender: {
        type: String,
        required: true,
        default: ""

    },
    address: {
        type: String,
        min: 6,
        default: ""
    },
    diagnosis: {
        type: String,
        required: true,
        default: ""

    },
    doctorsname: {
        type: String,
        default: ""
    },
 

    password: {
        type: String,
        required: true,
        min: 5,
    },
    roles: [{
        type: String,
        default: "بیمار"

    }],
    active: {
        type: Boolean,
        default: true
    }


}, )

module.exports = mongoose.model('User', userSchema)