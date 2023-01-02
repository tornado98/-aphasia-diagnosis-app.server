const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)


const resultsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    rightanswer: {
        type: String,
        required: true
    },
    wronganswer: {
        type: String,
        required: true,
        default: false
    }





}, {
    timestamps: true

})

resultsSchema.plugin(AutoIncrement, {
    inc_field: 'results',
    id: 'resultsNums',
    start_seq: 500
})
module.exports = mongoose.model('Results', resultsSchema);