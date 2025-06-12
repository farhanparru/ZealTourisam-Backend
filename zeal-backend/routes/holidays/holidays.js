const Holiday = require("../../models/Holiday");

// Get all Holidays (with optional pagination)
module.exports.get = async (req, res) => {
    try {
        const { page, perPage } = req.query;

        let holidays;
        if (page && perPage) {
            const total = await Holiday.countDocuments();
            holidays = await Holiday.find()
                .skip((page - 1) * perPage)
                .limit(parseInt(perPage));

            return res.status(200).json({
                success: true,
                results: holidays,
                page: parseInt(page),
                perPage: parseInt(perPage),
                total,
                totalPages: Math.ceil(total / perPage)
            });
        } else {
            holidays = await Holiday.find();
            return res.status(200).json({
                success: true,
                results: holidays
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error Getting Holidays" });
    }
};

// Get a single Holiday by ID
module.exports.getSingle = async (req, res) => {
    try {
        const { id } = req.params;
        const holiday = await Holiday.findById(id);

        if (!holiday) {
            return res.status(404).json({ success: false, message: "Holiday not found" });
        }

        res.status(200).json({ success: true, result: holiday });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error Getting Holiday" });
    }
};
// Get a single Holiday by Slug
module.exports.getBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const holiday = await Holiday.findOne({ slug });

        if (!holiday) {
            return res.status(404).json({ success: false, message: "Holiday not found" });
        }

        res.status(200).json({ success: true, results: holiday });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error Getting Holiday" });
    }
};


module.exports.add = async (req, res) => {
    try {
        
        
        // Handle images array
        const images = req.files && req.files['images'] 
        ? req.files['images'].map(file => file.path) // Use the Cloudinary URL
        : (req.body.images && typeof req.body.images === 'string' ? JSON.parse(req.body.images) : []);

         // Handle thumbnail
        const thumbnail = req.files && req.files['thumbnail'] && req.files['thumbnail'][0]
        ? req.files['images'].map(file => file.path) // Use the Cloudinary URL
         : (req.body.thumbnail || '');

        const pdfs = req.files && req.files['pdf']
            ? req.files['pdf'].map(file => ({ type: 'application/pdf', link: file.path }))
            : [];
        // Extract itinerary images
        const itineraryImages = (req.files && req.files['itineraryImages'])
            ? req.files['itineraryImages'].map(file => ({
                originalname: file.originalname, // Keep the original filename
                path: file.path
            }))
            : [];
        // Parse itinerary data from req.body (if exists)
        let {
            title,
            description,
            slug,
            tourOverview,
            faculty = '[]',
            details = '{}',
            highlights = '[]',
            itinerary = '[]',
            timings = '[]',
            pricing = '{}',
            bookingPolicy = '{}',
            overview = '',
            faq = '[]',
            rating = '{}'
        } = req.body;

        faculty = faculty ? JSON.parse(faculty) : [];
        highlights = highlights ? JSON.parse(highlights) : [];
        itinerary = itinerary ? JSON.parse(itinerary) : [];
        timings = timings ? JSON.parse(timings) : [];
        pricing = pricing ? JSON.parse(pricing) : { packageCost: [], tax: [] };
        bookingPolicy = bookingPolicy ? JSON.parse(bookingPolicy) : { cancellation: {}, childPolicy: {}, otherPolicies: [] };
        faq = faq ? JSON.parse(faq) : [];
        rating = rating ? JSON.parse(rating) : {};
        details = details ? JSON.parse(details) : {};

        if (itinerary) {
            itinerary.forEach((item, index) => {
                item.details.forEach((detail, ind) => {
                    if (itineraryImages && detail.image) {
                        const matchingImage = itineraryImages.find((img) => img.originalname === detail.image);
                        detail.image = matchingImage ? matchingImage.path : '';
                    } else {
                        detail.image = '';
                    }
                });
            });
        }

        // Create a new Holiday document
        const newHoliday = new Holiday({
            ...req.body,
            title,
            description,
            slug,
            images: images,
            thumbnail: thumbnail,
            pdf: pdfs,
            faculty: faculty,
            details: details,
            highlights: highlights,
            overview: overview,
            tourOverview,
            itinerary: itinerary,
            timings: timings,
            pricing: pricing,
            bookingPolicy: bookingPolicy,
            faq: faq,
            rating: rating
        });

        const savedHoliday = await newHoliday.save();

        res.status(200).json({ success: true, results: savedHoliday });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message, message: "Error adding holiday" });
    }
};
// Update an existing Holiday by ID

module.exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        let holiday = await Holiday.findById(id);
        if (!holiday) {
            return res.status(404).json({ success: false, message: "Holiday not found" });
        }

        // Extract files (if any) from req.files
        const images = req.files && req.files['images']
            ? req.files['images'].map(file => file.path)
            : holiday.images;

        const thumbnail = req.files && req.files['thumbnail']
            ? req.files['thumbnail'][0].path
            : holiday.thumbnail;

        const pdfs = req.files && req.files['pdf']
            ? req.files['pdf'].map(file => ({ type: 'application/pdf', link: file.path }))
            : holiday.pdf;

        const itineraryImages = req.files && req.files['itineraryImages']
            ? req.files['itineraryImages'].map(file => ({
                originalname: file.originalname,
                path: file.path
            }))
            : [];

        // Parse JSON fields if they exist
        const {
            faculty = '[]',
            details = '{}',
            highlights = '[]',
            itinerary = '[]',
            timings = '[]',
            pricing = '{}',
            bookingPolicy = '{}',
            faq = '[]',
            rating = '{}'
        } = req.body;

        const updatedFields = {};

        // Update only fields that are provided
        if (req.body.title) updatedFields.title = req.body.title;
        if (req.body.description) updatedFields.description = req.body.description;
        if (req.body.slug) updatedFields.slug = req.body.slug;
        if (images.length) updatedFields.images = images;
        if (thumbnail) updatedFields.thumbnail = thumbnail;
        if (pdfs.length) updatedFields.pdf = pdfs;
        if (req.body.overview) updatedFields.overview = req.body.overview;
        if (req.body.tourOverview) updatedFields.tourOverview = req.body.tourOverview;

        // Parse and update JSON fields if they exist
        if (faculty) updatedFields.faculty = JSON.parse(faculty);
        if (highlights) updatedFields.highlights = JSON.parse(highlights);
        if (itinerary) {
            const parsedItinerary = JSON.parse(itinerary);
            // Map the itinerary details and attach the corresponding image paths
            parsedItinerary.forEach((item) => {
                item.details.forEach((detail) => {
                    if (itineraryImages && detail.image) {
                        const matchingImage = itineraryImages.find((img) => img.originalname === detail.image); // Find the first matching image
                        detail.images = matchingImage ? [matchingImage.path] : []; // Store only the image path or an empty array if no match
                    } else {
                        detail.images = []; // Set to an empty array if itineraryImages or detail.image is null/undefined
                    }
                });
            });
            updatedFields.itinerary = parsedItinerary;
        }
        if (timings) updatedFields.timings = JSON.parse(timings);
        if (pricing) updatedFields.pricing = JSON.parse(pricing);
        if (bookingPolicy) updatedFields.bookingPolicy = JSON.parse(bookingPolicy);
        if (faq) updatedFields.faq = JSON.parse(faq);
        if (rating) updatedFields.rating = JSON.parse(rating);
        if (details) updatedFields.details = JSON.parse(details);

        // Update the Holiday document
        const updatedHoliday = await Holiday.findByIdAndUpdate(
            id,
            { $set: updatedFields }, // Only update the fields that are set in `updatedFields`
            { new: true } // Return the updated document
        );

        res.status(200).json({ success: true, results: updatedHoliday });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message, message: "Error updating Holiday" });
    }
};
// Delete a Holiday by ID
module.exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedHoliday = await Holiday.findByIdAndDelete(id);

        if (!deletedHoliday) {
            return res.status(404).json({ success: false, message: "Holiday not found" });
        }

        res.status(200).json({ success: true, message: "Holiday deleted successfully", data: deletedHoliday });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error deleting Holiday" });
    }
};