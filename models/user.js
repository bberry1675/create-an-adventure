let mongoose = require('mongoose')

let schema = new mongoose.Schema({
    googleid: String,
    username: String
})

module.exports = mongoose.model('User', schema)