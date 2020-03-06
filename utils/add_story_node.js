const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')})
const mongoose = require('mongoose');
const Nodes = require('../models/story_node')

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@main-cluster-g82re.mongodb.net/test?retryWrites=true&w=majority`,{useNewUrlParser: true, useUnifiedTopology: true})
let db = mongoose.connection;
db.on('error', (error) => {
    console.log('Failed to connect to database on startup: ', error)
    mongoose.disconnect();
    process.exit(1)
})

Nodes.findOne({action: null}, (err, res) =>{
    if(err){
        console.log("Error checking if there is a starting node", err);
        process.exit(1);
    }

    if(res){
        console.log("Database already has an exisiting starting node");
    }
    else{
        let startingNode = new Nodes({
            action: null,
            story: 'This is the beginning of the story please select a choice',
            next: []
        });

        startingNode.save((err, doc) => {
            if(err){
                console.log('Error saving the doc', err);
                mongoose.disconnect();
                return;
            }

            console.log('Saved doc:', doc)
            mongoose.disconnect();

        });
    }
})
