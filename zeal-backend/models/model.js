const mongoose = require('mongoose')
const { Schema } = mongoose

const modelSchema = new Schema({
    name: {
        type: String
    },
    number: {
        type:String
    }
})

const Model = mongoose.model('Model', modelSchema);
module.exports = Model