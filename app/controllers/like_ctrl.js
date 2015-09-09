var Like = require('../models/like');
var Post = require('../models/post');
var User = require('../models/user');
var async = require('async');

// api/posts/:postId/likes
exports.list = function(req,res){
	Like.find(function(err,likes){
		if(err)
			console.log(err);
		return res.json(likes);
	});
};

exports.pook = function(req,res){
	console.log(req.user);
	console.log(req.user.spec);
	if(req.user.spec.bamboo === 0){
		return res.json({
			type:false,
			status:"notEnough",
			message:"not enough bamboo"
		});
	}else{
		Post.findById(req.params.post_id, function(err, post){
			if(err){
				return res.json({
					type:false,
					message:"error occured"
				});
			}else if(!post){
				return res.json({
					type:false,
					message:"no post"
				});
			}else{
				if(post.pook){
					var pook = toUnixTime(post.pook);
					var check = (Date.now()/1000).toFixed(0) - pook;
					if(check < 86400){ //만 하루
						return res.json({
							type:false,
							status:"alreadyPooked",
							message:"already pooked"
						});
					}		
				}
				post.pook = Date.now();
				post.save(function(err){
					if(err){
						return res.json({
							type:false,
							message:"error occured"
						});
					}else{
						User.findByIdAndUpdate(req.user._id, {$inc:{"spec.bamboo":-1}}, function(err, user){
							if(err){
								return res.json({
									type:false,
									message:"error occured"
								});
							}else{
								return res.json({
									type:true,
									message:"yaya"
								});
							}
						});
					}
				});
			}
		});
	}
};

exports.likeToggle = function(req,res){
	async.waterfall([
		function(callback){
			Post.findOne({
				_id:req.params.post_id
			}, function(err, post){
				if(err){
					return res.json({
						type:false, 
						message:"error finding post"
					});
				}else if(!post){
					return res.json({
						type:false, 
						message:"there is no post with the id"
					});			
				}else{
					callback(null, post);
				}
			});
		},
	],function(err, post){
		var is_liked = function(){
			if(req.user){
				if(post.like_user_id.indexOf(req.user.id)>=0){
					console.log("found");
					return true;
				}else{
					console.log("not found");
					return false;
				}	
			}else{
				console.log("not logged in");
				return false;
			}	
		};		
		Like.findOne({
			user_id:req.user._id,
			post_id:req.params.post_id
		}, function(err, result){
			if(result) {     	
				console.log(result);
				result.remove(function(err){
					post.likes--;
					post.like_user_id.pull(req.user.id);
					post.save(function(err){
						if(err){
							return res.json({
								type:false, 
								message:"could not unlike"
							});
						} 
						return res.json({
							type:true, 
							message:"unliked",
							data:{
								is_liked:is_liked()
							}
						});
					});
				});
			}
			else{
				var like = new Like({
					post_id: req.params.post_id,
					user_id: req.user.id
				});			
				console.log(result);
				like.save(function(err, updated_like){
					if(err){ 
						return res.json({
							type:false,
							message:"could not save like"
						});
					} else {
						console.log(post);
						post.likes++;
						post.like_user_id.push(req.user.id);
						post.save(function(err){
							if(err){
								return res.json({
									type:false, 
									message:"could not like"
								});
							} 
							return res.json({
								type:true, 
								message:"liked",
								data:{
									is_liked:is_liked()
								}
							});
						});
					}
				});
			};
		});
	});
};

exports.dislikeToggle = function(req, res){

};

