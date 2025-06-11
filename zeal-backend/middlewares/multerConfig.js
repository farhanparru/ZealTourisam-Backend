const multer = require('multer');
const path = require('path');

// Define base upload directory (using absolute path)
const baseUploadDir = path.join(__dirname, '../uploads'); // Adjust path as needed

// Create directories if they don't exist
const ensureUploadDirs = () => {
  const dirs = [
    path.join(baseUploadDir, 'images'),
    path.join(baseUploadDir, 'thumbnails'),
    path.join(baseUploadDir, 'pdfs'),
    path.join(baseUploadDir, 'detailsImage')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Execute directory creation
ensureUploadDirs();

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use absolute paths
    if (file.fieldname === 'images') {
      cb(null, path.join(baseUploadDir, 'images'));
    } else if (file.fieldname === 'thumbnail') {
      cb(null, path.join(baseUploadDir, 'thumbnails'));
    } else if (file.fieldname === 'pdf') {
      cb(null, path.join(baseUploadDir, 'pdfs'));
    } else if (file.fieldname === 'detailsImage') {
      cb(null, path.join(baseUploadDir, 'detailsImage'));
    }
  },
  filename: (req, file, cb) => {
    // Improved filename sanitization
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-');
    cb(null, uniqueSuffix + '-' + sanitizedName);
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
