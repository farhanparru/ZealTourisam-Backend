require("dotenv").config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const app = express();




app.use(cors({
  origin:["https://admin-gules-five.vercel.app"],
  methods: ["GET,POST,PUT,DELETE,PATCH"],
  credentials: true,
}))



mongoose.connect('mongodb+srv://shaminmuhammad116:PARRU123@cluster0.u2uii.mongodb.net/TravelsToursWeb?retryWrites=true&w=majority&appName=Cluster0',{  
  useNewUrlParser: true,
  useUnifiedTopology: true 
}).then(()=>console.log('Databse connected')).catch((err)=>console.log("err",err))





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
