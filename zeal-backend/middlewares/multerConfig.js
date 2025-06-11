const multer = require('multer');
const path = require('path');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'images') {
      cb(null, 'uploads/images/');
    } else if (file.fieldname === 'thumbnail') {
      cb(null, 'uploads/thumbnails/');
    } else if (file.fieldname === 'pdf') {
      cb(null, 'uploads/pdfs/');
    } else if (file.fieldname === 'detailsImage') {
      cb(null, 'uploads/detailsImage/');
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Set up Multer file filter
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

// Initialize Multer with a size limit of 20MB
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB size limit
  fileFilter: fileFilter,
});

module.exports = upload;
