const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileSchema = new Schema({
    date: { type: Date, default: Date.now },
    description: String,
    image: String

});

module.exports = mongoose.model('File', FileSchema);