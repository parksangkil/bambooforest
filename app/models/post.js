var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//이미지도 여기에 넣자

var postSchema  = new Schema({
	title: {type:String},
	content: {type:String},
	likes:{type:Number, default:0},
	like_user_id:[{type:Schema.ObjectId, ref:'Like'}],
	comment_id:[{type:Schema.ObjectId, ref:'Comment'}],
	image_id:[{type:Schema.ObjectId, ref:'Image'}],
	pook:{type:Date},
	author:{
		user_id:{type:Schema.ObjectId},
		username:{type:String}
	},
	category_id:{type:Schema.ObjectId},
	created_at:{type:Date, default:Date.now},
	tags:[{
		_id:{type:Schema.ObjectId}, 
		tag_name:{type:String}
	}]
});

//export mongoose model
var Post = mongoose.model('Post', postSchema);
module.exports = Post;