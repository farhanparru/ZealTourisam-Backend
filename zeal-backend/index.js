require("dotenv").config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const app = express();



// console.log("Starting");

app.use(cors({
  origin:["https://zealtourismadmin.vercel.app"],
  methods: ["GET,POST,PUT,DELETE,PATCH"],
  credentials: true,
}))




mongoose.connect(process.env.MONGODB_URI,{  
  useNewUrlParser: true,
  useUnifiedTopology: true 
}).then(()=>console.log('Databse connected')).catch((err)=>console.log("err",err))





app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from uploads director
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));// Make sure this matches your BASE_U
console.log("Uploads path:", path.join(__dirname, "uploads"));


// Main Routes
app.use('/api/holidays', require("./routes/holidays/index"));
app.use('/api/admin', require("./routes/admin/index"));
app.use('/api/global-visa', require("./routes/global-visa/index"));
app.use('/api/umrahall', require('./routes/UmrahaforAll/index'))
app.use('/api/enquire', require("./routes/enquire/index"))
app.use('/api/globalvisa', require('./routes/EnquiryVisa/index'))






app.get('/', (req, res) => {
  res.send('Welcome to ZealTourism Backend!');
});






module.exports = app;
