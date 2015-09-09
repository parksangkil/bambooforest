var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');


var tagSchema  = new Schema({
	tag_name: {type:String},
	counter: {type:Number, default:1}
});



//export mongoose model
var Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;