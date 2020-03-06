const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config()

let indexRouter = require('./routes/index')

let app = express();

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});




//'mongodb+srv://testUser:<password>@main-cluster-g82re.mongodb.net/test?retryWrites=true&w=majority'
if(!process.env.DBUSER || !process.env.DBPASS){
    console.log('Missing DB credentials in environment file');
    process.exit(1);
}

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@main-cluster-g82re.mongodb.net/test?retryWrites=true&w=majority`,{useNewUrlParser: true, useUnifiedTopology: true})

let db = mongoose.connection

db.on('error', (error) => {
    console.log('Failed to connect to database on startup: ', error)
    mongoose.disconnect();
    process.exit(1)
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`App is listening on port: ${process.env.PORT || 3000}`)
});