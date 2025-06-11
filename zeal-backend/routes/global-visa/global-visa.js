const GlobalVisa = require("../../models/GlobalVisa");

module.exports.get = async (req, res) => {
    try {
        const { page = 1, perPage = 10 } = req.query;

        const total = await GlobalVisa.countDocuments();
        const GlobalVisas = await GlobalVisa.find()
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        res.status(200).json({
            success: true,
            results: GlobalVisas,
            page: parseInt(page),
            perPage: parseInt(perPage),
            total,
            totalPages: Math.ceil(total / perPage)
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error Getting GlobalVisas" });
    }
};


// Get a single Holiday by Slug
module.exports.getBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const globalVisa = await GlobalVisa.findOne({ slug });

        if (!globalVisa) {
            return res.status(404).json({ success: false, message: "Global Visa not found" });
        }

        res.status(200).json({ success: true, results: globalVisa });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error Getting GlobalVisa" });
    }
};

module.exports.getSingle = async (req, res) => {
    try {
        const { id } = req.params;
        const globalVisa = await GlobalVisa.findById(id);

        if (!globalVisa) {
            return res.status(404).json({ success: false, message: 'GlobalVisa not found' });
        }

        res.status(200).json({ success: true, results: globalVisa });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error Getting GlobalVisa" });
    }
};

const BASE_URL = 'https://zeal-tourisam-api.vercel.app/uploads'; // Change this to your server's URL

module.exports.add = async (req, res) => {
    try {
        // console.log(req.body);

        // Handle images array
        const images = req.files && req.files['images'] 
            ? req.files['images'].map(file => `${BASE_URL}/images/${file.filename.replace(/\\/g, '/')}`) // Use forward slashes
            : (req.body.images && typeof req.body.images === 'string' ? JSON.parse(req.body.images) : []);

        console.log(req.files, "farhan");

        // Handle thumbnail
        const thumbnail = req.files && req.files['thumbnail'] && req.files['thumbnail'][0]
            ? `${BASE_URL}/thumbnails/${req.files['thumbnail'][0].filename.replace(/\\/g, '/')}` // Use forward slashes
            : (req.body.thumbnail || '');

        // Create a new GlobalVisa object
        const newGlobalVisa = new GlobalVisa({
            ...req.body,
            images: images,
            thumbnail: thumbnail,
        });

        console.log(newGlobalVisa, "newGlobalVisa");

        // Save the new GlobalVisa object to the database
        const savedGlobalVisa = await newGlobalVisa.save();

        // Send success response
        res.status(200).json({ success: true, results: savedGlobalVisa });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


module.exports.update = async (req, res) => {
    try {
        const { id } = req.params;

        // Helper function to safely parse JSON if it's a valid JSON string
        const safeParse = (data) => {
            try {
                return typeof data === 'string' ? JSON.parse(data) : data;
            } catch (error) {
                return data;  // Return original data if parsing fails
            }
        };

        // Parse JSON strings to arrays/objects as needed
        let faq = safeParse(req.body.faq);
        let options = safeParse(req.body.options);
        let faculty = safeParse(req.body.faculty);
        let pricing = safeParse(req.body.pricing);

        // Handle images and thumbnail
        const images = req.files && req.files['images']
            ? req.files['images'].map(file => `${BASE_URL}/images/${file.filename.replace(/\\/g, '/')}`)
            : safeParse(req.body.images) || [];

        const thumbnail = req.files && req.files['thumbnail']
            ? `${BASE_URL}/thumbnails/${req.files['thumbnail'][0].filename.replace(/\\/g, '/')}`
            : req.body.thumbnail || '';

        // Update the GlobalVisa document
        const updatedGlobalVisa = await GlobalVisa.findByIdAndUpdate(
            id,
            {
                ...req.body,
                images: images.length ? images : undefined,
                thumbnail: thumbnail || undefined,
                faq,
                options,
                faculty,
                pricing
            },
            { new: true, runValidators: true }
        );

        if (!updatedGlobalVisa) {
            return res.status(404).json({ success: false, message: 'GlobalVisa not found' });
        }
        res.status(200).json({ success: true, results: updatedGlobalVisa });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Error updating GlobalVisa",
        });
    }
};




module.exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedGlobalVisa = await GlobalVisa.findByIdAndDelete(id);

        if (!deletedGlobalVisa) {
            return res.status(404).json({ success: false, message: 'GlobalVisa not found' });
        }

        res.status(200).json({ success: true, message: 'GlobalVisa deleted successfully', data: deletedGlobalVisa });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: 'Error deleting GlobalVisa' });
    }
};
