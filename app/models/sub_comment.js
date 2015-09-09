var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subCommentSchema  = new Schema({
	content: {type:String},
	post_id:{type:Schema.ObjectId, ref:'Post'},
	comment_id:{type:Schema.ObjectId, ref:'Comment'},
	author:{
		user_id: {type:Schema.ObjectId},
		username: {type:String}
	},
	created_at:{type:Date, default:Date.now}
});

var SubComment = mongoose.model('SubComment', subCommentSchema);
module.exports = SubComment;