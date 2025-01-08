const mongoose = require('mongoose');
const { Schema } = mongoose;

const EnquiryUmrahaSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
        match: [
            /^\+?[1-9]{1}[0-9]{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,9}$/,
            'Please provide a valid phone number with country code'
          ]
    },
    Category: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('EnquiryUmraha', EnquiryUmrahaSchema);