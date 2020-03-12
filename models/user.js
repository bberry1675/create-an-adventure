let mongoose = require('mongoose')

let schema = new mongoose.Schema({
    googleid: String,
    username: String,
    added_node: {type: mongoose.Schema.Types.ObjectId, ref: 'Node'}
})

module.exports = mongoose.model('User', schema)