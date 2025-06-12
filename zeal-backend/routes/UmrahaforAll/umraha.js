const UmrahaData = require("../../models/umraha");

// Get all Holidays (with optional pagination)
module.exports.get = async (req, res) => {
    try {
        const { page, perPage } = req.query;

        let UmrahaforAll;
        if (page && perPage) {
            const total = await UmrahaData.countDocuments();
            UmrahaforAll = await UmrahaData.find()
                .skip((page - 1) * perPage)
                .limit(parseInt(perPage));

            return res.status(200).json({
                success: true,
                results: UmrahaforAll,
                page: parseInt(page),
                perPage: parseInt(perPage),
                total,
                totalPages: Math.ceil(total / perPage)
            });
        } else {
            UmrahaforAll = await UmrahaData.find();
            return res.status(200).json({
                success: true,
                results: UmrahaforAll
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error Getting Holidays" });
    }
};


// Fetch data by slug
module.exports.getBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const data = await UmrahaData.findOne({ slug });

        if (!data) {
            return res.status(404).json({ success: false, message: "Umrah data not found" });
        }

        res.status(200).json({ success: true, results: data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error fetching Umrah data" });
    }
};

// Get a single Holiday by ID
module.exports.getSingle = async (req, res) => {
    try {
        const { id } = req.params;
        const UmrahaforAll = await UmrahaData.findById(id);
console.log(UmrahaforAll);

        if (!UmrahaforAll) {
            return res.status(404).json({ success: false, message: "Umraha Data not found" });
        }

        res.status(200).json({ success: true, results: UmrahaforAll });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error Getting Umraha" });
    }
};

// Add a Umrha



module.exports.add = async (req, res) => {
    

    try {
        // Handle images
        const images = req.files && req.files['images']
           ? req.files['images'].map(file => file.path) // Use the Cloudinary URL
            : (req.body.images && typeof req.body.images === 'string' ? JSON.parse(req.body.images) : []);

        // Handle thumbnail
        const thumbnail = req.files && req.files['thumbnail']
           ? req.files['thumbnail'][0].path // Use the Cloudinary URL
            : (req.body.thumbnail || '');

        // Handle detailsImage
        const detailsImage = req.files && req.files['detailsImage']
            ? req.files['detailsImage'][0].path // Use the Cloudinary URL
            : (req.body.detailsImage || '');

        // Parse nested JSON fields with safe parsing
        const parseJSON = (field) => {
            try {
                return typeof field === 'string' ? JSON.parse(field) : field;
            } catch (error) {
                console.error(`Error parsing field ${field}:`, error.message);
                return null;
            }
        };

        const itinerary = parseJSON(req.body.itinerary) || [];
        if (Array.isArray(itinerary.details)) {
            itinerary.details = itinerary.details.map((detail) => ({
                ...detail,
                detailsImage: detailsImage || '',
            }));
        }

        // Construct new UmrahaData document
        const newUmraha = new UmrahaData({
            ...req.body,
            images: images,
            thumbnail: thumbnail,
            bookingPolicy: parseJSON(req.body.bookingPolicy),
            faq: parseJSON(req.body.faq),
            pricing: parseJSON(req.body.pricing),
            packageDetails: parseJSON(req.body.packageDetails),
            itinerary: itinerary,
        });

        // Save to database
        const savedUmraha = await newUmraha.save();

        res.status(200).json({ success: true, results: savedUmraha });
    } catch (error) {
        console.error("Error adding Umrah:", error.message);
        res.status(500).json({ success: false, error: error.message, message: "Error adding Umrah" });
    }
};

// Update an existing Holiday by ID
module.exports.update = async (req, res) => {
    try {
        const { id } = req.params;  // Retrieve the ID from the route parameters
        const updatePackage = req.body; // Data to update

        // Normalize file paths for images
        const images = req.files && req.files['images']
            ? req.files['images'].map(file => `${BASE_URL}/images/${file.filename.replace(/\\/g, '/')}`)
            : (req.body.images && typeof req.body.images === 'string' ? JSON.parse(req.body.images) : []);

        // Handle thumbnail image
        const thumbnail = req.files && req.files['thumbnail']
            ? `${BASE_URL}/thumbnails/${req.files['thumbnail'][0].filename.replace(/\\/g, '/')}`
            : (req.body.thumbnail || '');

        // Handle detailsImage file
        const detailsImage = req.files && req.files['detailsImage']
            ? `${BASE_URL}/detailsImage/${req.files['detailsImage'][0].filename.replace(/\\/g, '/')}`
            : (req.body.detailsImage || '');

        // Safely parse JSON fields
        const parseJSON = (field) => {
            try {
                return typeof field === 'string' ? JSON.parse(field) : field;
            } catch (error) {
                console.error(`Error parsing field ${field}:`, error.message);
                return null;
            }
        };

        // Parse complex fields (itinerary, bookingPolicy, faq, etc.)
        const itinerary = parseJSON(req.body.itinerary) || [];
        if (Array.isArray(itinerary)) {
            itinerary.forEach(item => {
                if (item.details && Array.isArray(item.details)) {
                    item.details = item.details.map(detail => ({
                        ...detail,
                        detailsImage: detailsImage || '', // Ensure detailsImage is included
                    }));
                }
            });
        }

        // Prepare the update object
        const updatedUmraha = {
            ...updatePackage,
            images: images,
            thumbnail: thumbnail,
            bookingPolicy: parseJSON(req.body.bookingPolicy),
            faq: parseJSON(req.body.faq),
            pricing: parseJSON(req.body.pricing),
            packageDetails: parseJSON(req.body.packageDetails),
            itinerary: itinerary,
        };

        // Perform the update operation
        const result = await UmrahaData.findByIdAndUpdate(id, updatedUmraha, {
            new: true, // Return the updated document
            runValidators: true, // Ensure the update passes the schema validation
        });

        // Send a successful response
        res.status(200).json({ success: true, results: result });
        console.log("Update successful");

    } catch (error) {
        // Handle errors and send the response with error details
        console.error("Error during update:", error);
        res.status(500).json({ success: false, message: "Error updating Umraha", error: error.message });
    }
};


// Delete a Holiday by ID
module.exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUmraha = await UmrahaData.findByIdAndDelete(id);

        if (!deletedUmraha) {
            return res.status(404).json({ success: false, message: "Holiday not found" });
        }

        res.status(200).json({ success: true, message: "Holiday deleted successfully", data: deletedUmraha });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error deleting Holiday" });
    }
};
