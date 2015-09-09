var Tag = require('../models/tag');
var async = require('async');

// api/posts/:postId/tags
exports.list = function(req,res){
	Tag.find({counter:{$gte:1}}, function(err,tags){
		if(err)
			console.log(err);
		return res.json({
			type:true,
			data:tags
		});
	});
}

exports.shortList = function(req,res){
	Tag.find({counter:{$gte:1}}).sort({counter:-1}).limit(25).exec(function(err,tags){
		if(err)
			console.log(err);
		return res.json({
			type:true,
			data:tags
		});
	});
}