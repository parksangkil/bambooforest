
exports.list = function(req,res){
	if(req.path.indexOf("/api/posts/tags") > -1 && req.params.tags){
		console.log("tags");
		var tags = req.params.tags.split(',');
		var condition = {"tags.tag_name":{$all:tags}};
	}else if(req.path.indexOf("/api/best") > -1){
		console.log("best")
		var condition = undefined;
	}else{
		console.log("default")
		var condition = undefined;
	}
	if(req.params.current_id){
		condition._id = {$lte:req.params.current_id};
	}

	console.log(req.path);
	console.log(colors.green(condition));

	console.log(colors.green("Combined list current_id ->"),req.params.current_id);
	Post.find(condition)
		.limit(3)
		.sort({_id:-1})
		.exec(function(err, posts){
			return res.json({
				type:true,
				data:posts
			});
		});	
};


exports.listWithTags = function(req,res){
	var current_id = req.params.current;
	var tags = req.params.tags.split(',');
	console.log(colors.blue("PARSED TAGS",tags));

	var page_size = 20;
	var N = Number(req.params.next);
	console.log(colors.blue("PARSED NEXT PAGE: ", N, typeof(N)));
	console.log(colors.blue("PARSED CURRENT PAGE: ", current_id, typeof(current_id)));

	async.waterfall([
		function(callback){
			if(current_id.length < 24 ){ //24는 object_id 길이
				Post.find({tags:{$all:tags}})
					.limit(page_size)
					.sort({_id:-1})
					.exec(function(err, posts){
						if (err) {
							console.log(colors.red(err));
							return res.status(500).json({
								type: false,
								message: "error while pulling posts"
							});
						}
						else {
							console.log(colors.green("number of posts: ", posts.length));
							callback(null, posts);
						}				
					});
			}
			else{
				if(N >= 0) {
					Post.find({tags:{$all: tags}, _id:{$lte: current_id}})
						.skip(N * page_size)
						.limit(page_size)
						.sort({_id:-1})
						.exec(function(err, posts){
							if (err) {
								console.log(colors.red(err));
								return res.status(500).json({
									type: false,
									message: "error while pulling posts"
								});
							}
							else {
								console.log(colors.green("number of posts: ", posts.length));
								console.log(colors.green("jumped: ", N*page_size));
								callback(null, posts);
							}
						});
				}else if(N < 0){
					N = Math.abs(N);
					Post.find({tags:{$all: tags}, _id:{$gt: current_id}})
						.skip((N-1) * page_size)
						.limit(page_size)
						.sort({_id:1})
						.exec(function(err, posts){
							if (err) {
								console.log(colors.red(err));
								return res.status(500).json({
									type: false,
									message: "error while pulling posts"
								});
							}
							else {
								console.log(colors.green("number of posts: ", posts.length));
								console.log(colors.green("jumped: ", (N-1)*page_size));
								callback(null, posts);
							}
						});
				}else{
					return res.status(500).json({
						type:false,
						message:"error while pulling post"
					});
				}
			}
		}
	],function(err, posts){

		function toUnixTime(timeStamp){
			return (new Date(timeStamp).getTime() / 1000).toFixed(0);
		}

		// console.log(arguments);
		var data = posts.map(function(post){
			return {
				_id:post.id,
				title:post.title,
				// content:post.content, 나중에 마우스 올리면 뜨게 하는 식으로 해볼까 생각중
				tags:post.tags,
				created_at: toUnixTime(post.created_at),
				author:{
					user_id:post.author.user_id,
					username:post.author.username
				},
				comments:post.comment_id.length,
				likes:post.like_id.length
			}
		});

		//sort by object id
		var sorted = data.sort(function(a,b){
			if(a._id < b._id){
				return 1;
			}
			if(a._id > b._id){
				return -1;
			}
			return 0;
		});

		return res.json({
			type:true,
			data:sorted
		});
	});
};