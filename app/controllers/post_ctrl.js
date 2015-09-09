'use strict';

var async = require('async');
var colors = require('colors');

var Post = require('../models/post');
var Comment = require('../models/comment');
var User = require('../models/user');
var Tag = require('../models/tag');

//utils
function toUnixTime(timeStamp){
	return (new Date(timeStamp).getTime() / 1000).toFixed(0);
};

exports.bestShortList = function(req, res){
	Post.find({likes:{$gt:2}}).sort({_id:-1}).limit(7).exec(function(err, posts){
		if (err) {
			console.log(colors.red(err));
			return res.status(500).json({
				type: false,
				message: "error while pulling posts"
			});
		} else if(posts.length === 0) {
			return res.json({
				type: true,
				message: "no more posts",
				data: []
			});
		} else {
			return res.json({
				type:true,
				data:posts
			});
		}
	});
}


exports.list = function(req,res){
	var conditions = {};
	var sort = {_id:-1};
	var likes = 2;
	var skip;
	var PAGE_SIZE = 15;
	var next = Number(req.params.next_page);
	
	if(req.path.indexOf("/api/tags") > -1){ //tags
		var tags = req.params.tags.split(',');
		conditions["tags.tag_name"] = {$all:tags};
		var tag = true;
	}
	if(req.path.indexOf("/api/best") > -1 ){ //best
		conditions["likes"] = {$gt:likes};
		var best = true;
	}

	if(req.params.current_id && next >= 0){
		conditions["_id"] = {$lte:req.params.current_id};
		skip = next * PAGE_SIZE;
	}
	if(req.params.current_id && next < 0){
		conditions["_id"] = {$gt:req.params.current_id};
		skip = Math.abs(next * PAGE_SIZE) - PAGE_SIZE;
		sort = {_id:1};
	}

	async.waterfall([
		function(callback){ //찾는다
			Post.find(conditions)
				.skip(skip)
				.limit(PAGE_SIZE)
				.sort(sort)
				.exec(function(err, posts){
					if (err) {
						console.log(colors.red(err));
						return res.status(500).json({
							type: false,
							message: "error while pulling posts"
						});
					} else if(posts.length === 0) {
						return res.json({
							type: true,
							message: "no more posts",
							data: []
						});
					} else {
						var sorted = posts.sort(function(a,b){
							if(a._id < b._id){
								return 1;
							}
							if(a._id > b._id){
								return -1;
							}
							return 0;
						});
						callback(null, sorted);
					}	
				});
		},
		function(posts, callback){
			var page_conditions = {};
			if(tag){
				page_conditions["_id"] = {$gt:posts[0]};
				page_conditions["tags.tag_name"] = {$all:tags};
			}else if(best){
				page_conditions["_id"] = {$gt:posts[0]};
				page_conditions["likes"] = {$gt:likes};
			}else{
				page_conditions["_id"] = {$gt:posts[0]};
			}
			Post.find(page_conditions)
				.count(function(err, postCount){
					if (err) {
						return res.status(500).json({
							type:false,
							message:"error while counting"
						});
					}else{
						var currentPage = ((postCount/PAGE_SIZE)+1).toFixed(0);
						callback(null, posts, currentPage);
					}
				});
		},
		function(posts, currentPage, callback){
			var totalPage_conditions = {};
			if(tag){
				totalPage_conditions["tags.tag_name"] = {$all:tags};
			}
			if(best){
				totalPage_conditions["likes"] = {$gt:likes};
			}
			Post.find(totalPage_conditions).count(function(err, totalCount){
				if(err){
					return res.status(500).json({
						type:false,
						message:"error while counting 2"
					});
				}else{
					var totalPage = totalCount/PAGE_SIZE;
					if(totalCount % PAGE_SIZE){ //딱 나눠떨어지지 않으면 올림
						totalPage = Math.floor(totalPage + 1);
					}
					callback(null, posts, currentPage, totalPage);
				}
			});
		},
	], function(err, posts, currentPage, totalPage){//, max_page){
		if (err) {
			return res.status(500).json({
				type:false,
				message:"error while counting"
			});
		}else{
			return res.json({
				type:true,
				currentPage:Number(currentPage),
				totalPage:totalPage,
				data:posts
			});
		}
	});
};

exports.edit = function(req, res){
	if(!req.body.title || !req.body.content || !req.body.tags){
		return res.json({
			type:false,
			message:"invalid parameters"
		});
	}else if (!req.body.tags || req.body.tags.length === 0 || req.body.tags.length > 5) {
		return res.json({
			type:false,
			message:"please have at least one tag"
		});
	} else {
		Post.findById(req.params.post_id, function(err, post){
			if(err){
				return res.json({
					type:false,
					message:"error!"
				});
			}else if(!post){
				return res.json({
					type:false,
					message:"no post with the id"
				});
			}else if(post.likes > 1 || post.pook){
				return res.json({
					type:false,
					message:"liked or pooked"
				});
			}else{
				if(req.user._id.toString() !== post.author.user_id.toString()){
					return res.json({
						type:false,
						message:"notAuthorized"
					});	
				}else{
					post.title = req.body.title;
					post.content = req.body.content;

					console.log(post.tags);

					async.each(post.tags, function(tag_name, callback){
						
					});
					//포스트 업뎃 하고, 테그 있으면 아무것도 하지 않고 만약 새로운 테그가 들어오면 첨부하며 원래 있던 테그가 사라졌으면 삭제하기
					/*
					post.save(function(err, post){
						async.each(req.body.tags, function(tag_name, callback){
							Tag.findOneAndUpdate({tag_name:tag_name}, {$inc:{counter:1}}, function(err, tag){
								if(tag){
									post.tags.push({
										_id:tag.id,
										tag_name:tag_name
									});
									callback();
								}else{
									var newTag = new Tag({
										tag_name:tag_name
									});
									newTag.save(function(err, tag){
										post.tags.push({
											_id:tag.id,
											tag_name:tag_name
										});
										callback();
									});
								}
							});
						}, function(err){
							if(err){console.log(err);}
							else{
								post.save(function(err){
									if(err){
										return res.json({
											type:false,
											message:"error"
										});
									}else{
										return res.json({
											type:true,
											messsage:"post successfully created with tags",
											data:{
												post_id:post.id,
												title:post.title
											}
										});								
									}
								});
							}
						});
					});
					*/
				}
			}
		});
	}
}


//api/post/:post_id
exports.detail = function(req,res){
	async.waterfall([
		function(callback){ //아이디로 게시물 정보 받아오기
			Post.findById(req.params.post_id, function(err, post){
				if(err) return res.json({
					type:false,
					message:"couldn't find the post"
				});
				callback(null, post);
			});
		}
	],function(err, post){

		//내가 좋아요를 눌렀는지 확인
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

		if(err){
			console.log(err);
		}else{
			if(post.pook){
				var pook = toUnixTime(post.pook);
				var check = (Date.now()/1000).toFixed(0) - pook;
				if(check < 86400){ //만 하루
					return res.json({
						type:true,
						status:"pooked",
						data:{
							_id:post.id,
							title:post.title,
							author:post.author,
							content:"[죽창에 찔린 게시물입니다. 하루동안 볼 수 없습니다.]",
							created_at:post.created_at,
							tags:post.tags,
							likes:post.likes,
							is_liked:is_liked()
						}	
					});
				}
			}
			return res.json({
				type:true,
				data:{
					_id:post.id,
					title:post.title,
					author:post.author,
					content:post.content,
					created_at:post.created_at,
					tags:post.tags,
					likes:post.likes,
					is_liked:is_liked()
				}
			});
		}
	});
};


exports.create = function(req,res){
	if(!req.body.title || !req.body.content || req.body.title.length < 1 ||req.body.content.length < 5){
		res.json({
			type:false,
			data:"invalid parameters"
		});
	}else{
		if (!req.body.tags || req.body.tags.length === 0 || req.body.tags.length > 5){
			return res.json({
				type:false,
				message:"please have at least one tag"
			});
		} else {
			var post = new Post({
				title: req.body.title,
				content: req.body.content,
				author:{
					user_id: req.user.id,
				}
			});
			if(req.user.nickname){
				post.author.username = req.user.nickname;
			}else{
				post.author.username = req.user.username;
			}
			post.save(function(err, post){
				async.each(req.body.tags, function(reqTag, callback){
					Tag.findOneAndUpdate(reqTag, {$inc:{counter:1}}, function(err, tag){
						if(tag){
							post.tags.push({
								_id:tag.id,
								tag_name:tag.tag_name
							});
							callback();
						}else{
							var newTag = new Tag({
								tag_name:reqTag.tag_name
							});
							newTag.save(function(err, tag){
								post.tags.push({
									_id:tag.id,
									tag_name:tag.tag_name
								});
								callback();
							});
						}
					});
				}, function(err){
					if(err){console.log(err);}
					else{
						post.save(function(err){
							if(err){
								return res.json({
									type:false,
									message:"error"
								});
							}else{
								return res.json({
									type:true,
									messsage:"post successfully created with tags",
									data:{
										post_id:post.id,
										title:post.title
									}
								});								
							}
						});
					}
				});
			});
		}
	}
};