var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema  = new Schema({
	content: {type:String},
	post_id:{type:Schema.ObjectId, ref:'Post'},
	// sub_comment:[{type:Schema.ObjectId, ref:'SubComment'}],
	author:{
		user_id: {type:Schema.ObjectId},
		username: {type:String}
	},
	created_at:{type:Date, default:Date.now}
});

var Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;