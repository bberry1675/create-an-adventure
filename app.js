const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const Nodes = require('./models/story_node');
require('dotenv').config()
const ejs = require('ejs')
let indexRouter = require('./routes/index');
let nodeRouter = require('./routes/node.js');

let app = express();


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'./views'))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/node',nodeRouter);

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

Nodes.findOne({action: null},(err, res) => {
    if(err){
        console.log('Error looking for the starting document',err);
        process.exit(1);
    }
    else{
        if(res){
            console.log("found the starting document with id: " + res._id);
            app.set('starting_id',res._id);
        }
        else{
            console.log("Did not find a starting story node");
            process.exit(1);
        }
    }
})

app.listen(process.env.PORT || 3000, process.env.IP || "localhost" ,() => {
    console.log(`App is listening on ${process.env.IP || "localhost"}:${process.env.PORT || 3000}`)
});