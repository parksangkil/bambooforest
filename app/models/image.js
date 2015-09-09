var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema  = new Schema({
	title: {type:String},
	user_id: Schema.ObjectId,
	post_id: {type:Schema.ObjectId, ref:'Post'},
	created_at:{type:Date, default:Date.now}
});

//export mongoose model
var Image = mongoose.model('Image', imageSchema);
module.exports = Image;