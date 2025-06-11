const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Cloudinary storage with folder based on fieldname
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    let folder;
    if (file.fieldname === 'images') {
      folder = 'images';
    } else if (file.fieldname === 'thumbnail') {
      folder = 'thumbnails';
    } else if (file.fieldname === 'pdf') {
      folder = 'pdfs';
    } else if (file.fieldname === 'detailsImage') {
      folder = 'details_images';
    }
    
    return {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      public_id: Date.now() + '-' + path.parse(file.originalname).name,
      resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image',
      transformation: file.fieldname === 'thumbnail' ? [{ width: 300, height: 300, crop: 'limit' }] : []
    };
  }
});

// File filter remains the same
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|pdf/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Only images (jpeg, jpg, png) and PDFs are allowed!');
  }
};

// Initialize Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB size limit
  fileFilter: fileFilter,
});

module.exports = upload;