let mongoose = require('mongoose');

let schema = new mongoose.Schema({
    action: {type: String, minLength: 4, maxLength: 50},
    story: {type: String, required: true, minLength: 50, maxLength: 300},
    next: {type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Node'}], required: true}
});

module.exports = mongoose.model('Node', schema);