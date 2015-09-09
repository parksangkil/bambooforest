var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var likeSchema  = new Schema({
	user_id: Schema.ObjectId,
	post_id: {type:Schema.ObjectId, ref:'Post'},
	created_at:{type:Date, default:Date.now}
});

var Like = mongoose.model('Like', likeSchema);
module.exports = Like;