var User = require('../models/user');
var jwt = require('jsonwebtoken');
var async = require('async');

function toUnixTime(timeStamp){
	return (new Date(timeStamp).getTime() / 1000).toFixed(0);
}

String.prototype.isAlphaNumeric = function() {
  var regExp = /^[A-Za-z0-9]+$/;
  return (this.match(regExp));
};

// api/users
exports.signup = function(req,res){
	if(!req.body.email || !req.body.password || !req.body.username || !req.body.username.isAlphaNumeric() || req.body.username > 6){
		return res.json({
			type:false,
			message:"invalid parameter"
		});
	}
	async.waterfall([
		function(callback){
			User.findOne({email:req.body.email}, function(err,user){
				if(err){
					console.log(err);
					return res.json({
						type:false,
						message:"error1"
					});
				}else if (user){
					return res.json({
						type:false,
						message:"email exists"
						});
				}else{
					callback(null);
				}
			});
		},
		function(callback){
			User.findOne({username:req.body.username}, function(err,user){
				if(err){
					console.log(err);
					return res.json({
						type:false,
						message:"error2"
					});
				}else if (user){
					return res.json({
						type:false,
						message:"username exists"
						});
				}else{
					callback(null);
				}
			});
		}
	], function(err, results){
		if(err){
			console.log(err);
			return res.json({
				type:false,
				message:"error3"
			});
		}
		var user = new User({
			email: req.body.email,
			password: req.body.password,
			username: req.body.username,
			nickname: req.body.username,
			last_ip: req.ip
		});
		
		user.save(function(err,user){
			if(err){
				console.log(err);
				return res.json({
					type:false,
					message:"error4"
				});
			}
			user.token = jwt.sign(user.email+Date.now(), "testtoken") // should change to process.env.JWT_SECRET later
			user.save(function(err,user1){
				if(err){
					console.log(err);
					return res.json({
						type:false,
						message:"error5"
					});
				}
				return res.json({
					type:true,
					data:{
						user_id:user1._id,
						username:user1.username,
						token:user1.token
					}
				});
			});
		});
	});
};



exports.signin = function(req,res){
	if(req.user){
		if(req.user.pook){
			var pook = toUnixTime(req.user.pook);
			console.log("pook",pook);
			var check = (Date.now()/1000).toFixed(0) - pook;
			console.log("check",check);
			if(check < 86400){
				return res.json({
					type:false,
					message:"YOU ARE POOKED"
				});
			}
		}

		return res.json({
			type:true,
			data:{
				user_id:req.user._id,
				username:req.user.username,
				nickname:req.user.nickname,
				token:req.user.token
			}
		});
	}else{
		return res.json({
			type:false,
			message:"authentication failed"
		});
	}
};

exports.me = function(req,res){
	if(req.user.pook){
		var pook = toUnixTime(req.user.pook);
		var check = (Date.now()/1000).toFixed(0) - pook;
		if(check < 86400){ //만 하루
			return res.json({
				type:false,
				message:"YOU ARE POOKED"
			});
		}			
	}
	return res.json({
		type:true,
		data:{
			user_id:req.user._id,
			nickname:req.user.nickname,
			username:req.user.username,
			token:req.user.token
		}
	});
};


exports.details = function(req,res){
	User.findById(req.params.user_id, function(err, user){
		if(err){
			return res.status(500).json({
				type:false,
				message:"error"
			});
		}else{
			var isMe = false;
			if(req.user){
				if(user._id.toString() === req.user._id.toString()){
					console.log("IT IS ME!!")
					isMe = true;
				}
			}
			

			var isPooked = false;
			if(user.pook){
				var pook = toUnixTime(user.pook);
				var check = (Date.now()/1000).toFixed(0) - pook;
				if(check < 86400){
					isPooked = true;
				}			
			}

			return res.json({
				type:true,
				data:{
					user_id: user._id,
					username: user.username,
					nickname: user.nickname,
					spec: user.spec,
					isMe: isMe,
					isPooked: isPooked,
					created_at: user.created_at,
				}
			});
		}
	});
}

exports.bamboo = function(req, res){
	function getRandom(){
	  var num=Math.random();
	  console.log(num);
	  if(num > 0.95) return 1;  //probability 0.05
	  else return 0;
	}
	User.findById(req.user._id, function(err, user){
		if(err){
			return res.json({
				type:false,
				message:"error occured"
			});
		}else{
			var lastBamboo = false;
			if(user.last_bamboo){
				// var pook = toUnixTime(user.last_bamboo);
				var check = (Date.now()/1000).toFixed(0) - toUnixTime(user.last_bamboo);
				if(check < 86400){
					lastBamboo = true;
				}			
			}
			console.log(lastBamboo);
			if(lastBamboo){
				return res.json({
					type:true,
					status:"alreadyDone"
				});
			}else{
				var dice = getRandom();
				console.log(dice);
				if(!dice){
					user.last_bamboo = Date.now();
					user.save(function(err, user1){
						if(err){
							return res.json({
								type:false,
								message:"error"
							});
						}else{
							return res.json({
								type:true,
								status:"failed"
							});					
						}
					});					
				}else{
					user.last_bamboo = Date.now();
					user.spec.bamboo++;
					user.save(function(err, user1){
						if(err){
							return res.json({
								type:false,
								message:"error"
							});
						}else{
							return res.json({
								type:true,
								message:"got bamboo!"
							});							
						}
					});
				}
			}
		}
	});
}

// api/users
exports.list = function(req,res){
	User.find(function(err,users){
		if(err)
			console.log(err);
		return res.json(users);
	});
};

exports.edit = function(req, res){
	if(!req.body.nickname || req.body.nickname.length > 6 || req.body.nickname.indexOf(" ")>0){
		return res.json({
			type:false,
			message:"invalid parameters"
		});
	}else{
		User.findById(req.params.user_id, function(err, user){
			if(err){
				return res.json({
					type:false,
					message:"error!"
				});
			}else if(!user){
				return res.json({
					type:false,
					message:"no user with the id"
				})
			}else{
				if(!(req.user._id.toString() == user._id.toString())){
					return res.json({
						type:false,
						message:"notAuthorized"
					});	
				}else{
					user.nickname = req.body.nickname
					user.save(function(err){
						if(err){
							return res.json({
								type:false,
								message:"error"
							});
						}else{

							var isMe = false;
							if(req.user){
								if(user._id.toString() === req.user._id.toString()){
									console.log("IT IS ME!!")
									isMe = true;
								}
							}
							

							var isPooked = false;
							if(user.pook){
								var pook = toUnixTime(user.pook);
								var check = (Date.now()/1000).toFixed(0) - pook;
								if(check < 86400){
									isPooked = true;
								}			
							}

							return res.json({
								type:true,
								message:"it works",
								data:{
									user_id: user._id,
									username: user.username,
									nickname: user.nickname,
									spec: user.spec,
									isMe: isMe,
									isPooked: isPooked,
									created_at: user.created_at,
								}
							});							
						}
					});
				}
			}
		});
	}
}


// api/users/:name
// exports.delete = function(req,res){
// 	User.remove({_id:req.user._id, name:req.req.body.name}, function(err){
// 		if(err) console.log(err);
// 		return res.json({status:"done"});
// 	});
// };

// api/users/:name
// exports.put = function(req,res){
// 	User.update({_id:req.user._id, name:req.req.body.name}, 
// 		{password:req.body.password}, 
// 		function(err, user){
// 		if(err) console.log(err);
// 		return res.json({status:"done"});
// 	});
// };


exports.pook = function(req,res){
	console.log(req.user.spec);
	if(req.user.spec.bamboo === 0){
		return res.json({
			type:false,
			status:"notEnough",
			message:"not enough bamboo"
		});
	}else{
		User.findById(req.params.user_id, function(err, user){
			if(err){
				return res.json({
					type:false,
					message:"error occured"
				});
			}else if(!user){
				return res.json({
					type:false,
					message:"no user"
				});
			}else{
				if(user.pook){
					var pook = toUnixTime(user.pook);
					var check = (Date.now()/1000).toFixed(0) - pook;
					if(check < 86400){ //만 하루
						return res.json({
							type:false,
							status:"alreadyPooked",
							message:"already pooked"
						});
					}		
				}
				user.pook = Date.now();
				user.save(function(err){
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
									status:"pook",
									message:"pooked"
								});
							}
						});				
					}
				});
			}
		});
	}
};