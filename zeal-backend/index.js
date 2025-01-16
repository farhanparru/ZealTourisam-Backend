require("dotenv").config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors")
var indexRouter = require('./routes/index');
const { default: mongoose } = require("mongoose");


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

// app.use('/api/model', require("./routes/model/index"))
app.use('/', indexRouter);
app.use('/api/holidays', require("./routes/holidays/index"));
app.use('/api/admin', require("./routes/admin/index"));
app.use('/api/global-visa', require("./routes/global-visa/index"));
app.use('/api/umrahaall', require('./routes/Umraha for all/index'))
app.use('/api/enquire', require("./routes/enquire/index"))
app.use('/api/globalvisa', require('./routes/EnquiryVisa/index'))

// Middleware to parse JSON bodies
// app.use(bodyParser.json());

// Endpoint to handle enquiry submission
app.post('/api/enquiry', (req, res) => {
  const enquiryData = req.body;
  console.log('Received Enquiry Data:', enquiryData);

  // Here you can handle the data (save to database, send email, etc.)

  // Respond back to the client
  res.json({ message: 'Enquiry received successfully!' });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


app.get('/',(req,res)=>{
    res.send('MY ZealTourisam')
})


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
