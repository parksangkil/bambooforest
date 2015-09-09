var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var noticeSchema  = new Schema({
	title: {type:String},
	content: {type:String},
	created_at:{type:Date, default:Date.now},
	author:{
		user_id:{type:Schema.ObjectId},
		username:{type:String}
	}
});

//export mongoose model
var Notice = mongoose.model('Notice', noticeSchema);
module.exports = Notice;