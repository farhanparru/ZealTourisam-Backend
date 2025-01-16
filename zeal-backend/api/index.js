require("dotenv").config(); // Load environment variables
const express = require('express'); // Import express
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors'); // CORS middleware
const mongoose = require('mongoose'); // MongoDB
const bodyParser = require('body-parser');
const app = express(); // Create the express app instance

// CORS configuration
const corsConfig = {
    origin: "*", // Allow all origins, adjust as needed
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
};



// Apply CORS middleware to all routes
app.use(cors(corsConfig));

// Optionally handle pre-flight requests (this is typically done with middleware)
app.options('*', cors(corsConfig)); // Allow all routes for OPTIONS request




app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use('/api/holidays', require("../routes/holidays/index"));
app.use('/api/admin', require("../routes/admin/index"));
app.use('/api/global-visa', require("../routes/global-visa/index"));
app.use('/api/umrahaall', require('../routes/Umraha for all/index'))
app.use('/api/enquire', require("../routes/enquire/index"))
app.use('/api/globalvisa', require('../routes/EnquiryVisa/index'))

// Middleware to parse JSON bodies




app.get('/', (req, res) => {
  res.send('Welcome to ZealTourism Backend!');
});



module.exports = app;
