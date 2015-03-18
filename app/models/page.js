var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PageSchema   = new Schema({
    title: String,
    content: String
});

module.exports = mongoose.model('Page', PageSchema);
