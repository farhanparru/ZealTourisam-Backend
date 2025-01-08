const mongoose = require('mongoose');
const { Schema } = mongoose;

const EnquiryVisaSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        match: [
            /^\+?[1-9]{1}[0-9]{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,9}$/,
            'Please provide a valid phone number with country code'
          ]
    },
    visaCategory: {
        type: String,
        required: true,
    },
    dateOfTravel: {
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

module.exports = mongoose.model('EnquiryVisa', EnquiryVisaSchema);
