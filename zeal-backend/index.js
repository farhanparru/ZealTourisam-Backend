require("dotenv").config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const app = express();



console.log("Starting");

app.use(cors({
  origin:["https://zealtourismadmin.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}))




mongoose.connect('mongodb+srv://shaminmuhammad116:PARRU123@cluster0.jnuxpcv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000 // Close sockets after 45s of inactivity
})
.then(() => console.log('Database connected'))
.catch(err => {
  console.error("Database connection error:", err);
  process.exit(1); // Exit process with failure
});

// Handle connection events
mongoose.connection.on('connected', () => console.log('Mongoose connected'));
mongoose.connection.on('error', err => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));



app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from uploads director
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));// Make sure this matches your BASE_U
// console.log("Uploads path:", path.join(__dirname, "uploads"));


app.use('/api/holidays', require("./routes/index"));
app.use('/api/admin', require("./routes/admin/index"));
app.use('/api/global-visa', require("./routes/global-visa/index"));
app.use('/api/umrahall', require('./routes/Umraha for all/index'))
app.use('/api/enquire', require("./routes/enquire/index"))
app.use('/api/globalvisa', require('./routes/EnquiryVisa/index'))

// Middleware to parse JSON bodies




app.get('/', (req, res) => {
  res.send('Welcome to ZealTourism Backend!');
});






module.exports = app;
