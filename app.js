var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");


var authRouter = require('./routes/auth.route');
var userRouter = require('./routes/user.route');
var productRouter = require('./routes/product.route');
var orderRouter = require('./routes/order.route');

var app = express();
// CORS Configuration
var corsOptions = {
  origin: 'http://localhost:3000', // Ganti dengan alamat frontend Anda
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Mengizinkan cookies atau header Authorization untuk dikirim
};

// Apply CORS middleware globally
app.use(cors(corsOptions));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "./node_modules/preline/dist")));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api', orderRouter);
app.use('/uploads', express.static('uploads'));

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
