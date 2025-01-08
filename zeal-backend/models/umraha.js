const mongoose = require('mongoose');
const { Schema } = mongoose;


// Schema for Itinerary details
const HotelDetails = new Schema({
    Hoteltitle: { type: String },
    image: { type: String },
    location: { type: String },
    roomType: { type: String },
    checkIn: { type: String },
    checkout: { type: String }
}, { _id: false });

const TransportDetails = new Schema({
    Transporttitle: { type: String },
    image: { type: String },
    from: { type: String },
    to: { type: String },
    time: {
        timeTitle: { type: String }, // AM/PM
        time: { type: String }
    }
})

// Schema for Itinerary
const ItinerarySchema = new Schema({
    place: { type: String },
    description: { type: String },
    ItineraryDay: { type: String },   //Day : 1/2/3/4
    ItineraryDate: { type: String },
    HotelDetails: { HotelDetails },
    TransportDetails: { TransportDetails }
}, { _id: false });

// Schema for Pricing details
const PricingDetailSchema = new Schema({
    title: { type: String },
    amount: { type: Number },
    currency: { type: String }
}, { _id: false });

// Schema for Booking Policy
const PolicySchema = new Schema({
    title: { type: String },
    description: { type: String }
}, { _id: false });

// Schema for FAQ
const FaqSchema = new Schema({
    question: { type: String },
    answer: { type: String }
}, { _id: false });

// Schema for Ratings
// const DetailsSchema = new Schema({

// }, { _id: false });

// Main schema
const UmrahaSchema = new Schema({
    title: { type: String },
    description: { type: String },
    images: [{ type: String }],
    thumbnail: { type: String },

    packageDetails: {
        Days: { type: String },
        Nights: { type: String },
        Country: { type: String },
        Cities: { type: String },
        TravelFrom: { type: String },
        TravelTo: { type: String },
        TravelDate: { type: String },
        TravelTime: {
            timeTitle: { type: String },
            time: { type: String }
        }
    },

    slug: { type: String },

    overview: { type: String },
    tourOverview: { type: String },
    faculty: [{ type: String }], // Assuming an array of strings or more complex subdocuments
    pricing: {
        adultNo: { type: String },
        childNo: { type: String },
        infantNo: { type: String },
        packageCost: [PricingDetailSchema],
        tax: [PricingDetailSchema],
        totalAmount: { type: String }
    },
    inclusion: [{ type: String }],
    exclusion: [{ type: String }],
    itinerary: [ItinerarySchema],

    AdditionalInformation: [{ type: String }],
    bookingPolicy: {
        cancellation: { type: String },
        childPolicy: { type: String },
        faq: [FaqSchema],
        otherPolicies: [PolicySchema] // To handle any additional dynamic policies
    },
}, { timestamps: true });

// Export the model
module.exports = mongoose.model('Umraha for all ', UmrahaSchema);
