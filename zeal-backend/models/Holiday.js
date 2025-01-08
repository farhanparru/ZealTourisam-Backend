const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for PDF links
const PdfSchema = new Schema({
    type: { type: String, required: true },
    link: { type: String, required: true }
});

// Schema for Itinerary details
const ItineraryDetailsSchema = new Schema({
    title: { type: String },
    icon: { type: String },
    category: { type: String },
    location: { type: String },
    room: { type: String },
    checkIn: { type: String },
    checkout: { type: String }
}, { _id: false });

// Schema for Itinerary
const ItinerarySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    place: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    details: [ItineraryDetailsSchema]
}, { _id: false });

// Schema for Pricing details
const PricingDetailSchema = new Schema({
    title: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, required: true }
}, { _id: false });

// Schema for Booking Policy
const PolicySchema = new Schema({
    title: { type: String },
    description: { type: String }
}, { _id: false });

// Schema for FAQ
const FaqSchema = new Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
}, { _id: false });

// Schema for Ratings
const RatingSchema = new Schema({
    reviews: [{ type: String }], // Array of review strings or a more complex object
    stars: { type: Number, min: 0, max: 5, default: 4.0 },
    ratingCount: { type: Number, default: 0 },
    review: { type: String },
    details: [{}]
}, { _id: false });

// Main schema
const HolidaySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    thumbnail: { type: String },
    pdf: [PdfSchema],
    details: Object,
       /* {
        share: { type: String },
        fcb: { type: String },
        from: { type: String },
        to: { type: String },
        duration: { type: String },
        date: { type: String },
        price: { type: String },
        discount: { type: String },
        discountPrice: { type: String },
        discountPercentage: { type: String }
        highlights: [{ type: String }],
        tags: [{ type: String }],
    }*/
    faculty: [{ type: String }], // Assuming an array of strings or more complex subdocuments
    overview: { type: String },
    itinerary: [ItinerarySchema],
    tourOverview: { type: String },
    inclusion: [{ type: String }],
    exclusion: [{ type: String }],
    timings: [{
        title: { type: String },
        time: { type: String }
    }],
    pricing: {
        packageCost: [PricingDetailSchema],
        tax: [PricingDetailSchema]
    },
    bookingPolicy: {
        cancellation: PolicySchema,
        childPolicy: PolicySchema,
        otherPolicies: [PolicySchema] // To handle any additional dynamic policies
    },
    faq: [FaqSchema],
    rating: RatingSchema
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt fields

// Export the model
module.exports = mongoose.model('Holiday', HolidaySchema);
