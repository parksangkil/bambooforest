var Comment = require('../models/comment');
var Post = require('../models/post');
var async = require('async');
var colors = require('colors');

exports.listWithPage = function(req,res){
	var current_id = req.params.current;
	var N = Number(req.params.next);
	var page_size = 3;

	async.waterfall([
		function(callback){
			if(current_id === 0){
				callback(null, "nono");
			}
			else{
				if(N >= 0){
					Comment.find({post_id:req.params.post_id, _id:{$gte: current_id}})
						.skip(N * page_size)
						.limit(page_size)
						.sort({_id:1})
						.exec(function(err,comments){
						if(err){
							console.log(err);
							return res.json({
								type:false,
								message:"could not pull comment list"
							});
						}else{
							console.log(colors.green("number of comments: ", comments.length));
							console.log(colors.green("jumped: ", N*page_size));
							callback(null, comments);
						}
					});
				}else if(N < 0){
					// **** 고쳐야됨 머리아파서 냅둠 -로 가면 제대로 안나옴 ***//
					N = Math.abs(N);
					Comment.find({post_id:req.params.post_id, _id:{$lt: current_id}})
						.skip((N-1) * page_size)
						// .limit(page_size)
						.sort({_id:1})
						.exec(function(err,comments){
						if(err){
							console.log(err);
							return res.json({
								type:false,
								message:"could not pull comment list"
							});
						}else{
							console.log(colors.green("number of comments: ", comments.length));
							console.log(colors.green("jumped: ", (N-1)*page_size));
							callback(null, comments);
						}
					});
				}else{
					return res.json({
						type:false,
						message:"could not pull comment list"
					});
				}
			}
		}
	], function(err, comments){
		var comment_list = comments.map(function(comment){
			return {
				_id:comment.id,
				content:comment.content,
				// created_at:comment.created_at,
				// author:{
				// 	user_id:comment.author.user_id,
				// 	username:comment.author.username
				// }
			}
		});
		return res.json({
			type:true,
			data:comment_list
		});
	});
};

exports.list = function(req, res){
	Comment.find({post_id:req.params.post_id}, function(err, comments){
		if(err){
			return res.json({
				type:false,
				message:"could not pull comment list"
			});
		}else{
			return res.json({
				type:true,
				data:comments
			})
		}
	});
};


exports.edit = function(req, res){
	return res.json({
		type:true
	});
}

exports.create = function(req,res){
	if (!req.body.content){
		return res.json({
			type:false,
			message:"invalid parameter"
		});
	}else{
		Post.findById(req.params.post_id, function(err, post){
			if (err) {
				console.log(colors.red(err));
				return res.json({
					type:false,
					message:"error finding post"
				});
			} else if (!post){
				return res.json({
					type:false,
					message:"no post with the id"
				});
			} else {
				var comment = new Comment({
					content: req.body.content,
					post_id: req.params.post_id,
					author:{
						user_id: req.user.id
					}
				});
				if(req.user.nickname){
					comment.author.username = req.user.nickname;
				}else{
					comment.author.username = req.user.username;
				}				
				// console.log(colors.green(post));
				comment.save(function(err, comment){
					if(err){
						return res.json({
							type:false,
							message:"could not save comment"
						});
					}else{
						// console.log(colors.yellow(comment));
						post.comment_id.push(comment);
						post.save(function(err){
							if(err){
								return res.json({
									type:false,
									message:"could not update post"
								});
							}else{
								return res.json({
									type:true,
									message:"successful"
								});
							}	
						});
					}
				});
			}
		});
	}
};

