var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
// var DigestStrategy = require('passport-http').DigestStrategy;
var User = require('../models/user');
var colors = require('colors');
var jwt = require('jsonwebtoken');


passport.use(new BasicStrategy({ passReqToCallback : true },
	function(req, username, password, callback){
		User.findOne({username:username}, function(err,user){
			if(err){return callback(err);}
			//no user found with the email
			if(!user){return callback(null, false);}
			user.verifyPassword(password, function(err,isMatch){
				if(err){ return callback(err);}
				// password did not match
				if(!isMatch){return callback(null,false);}
				
				//success
				// UPDATE USER INFO
				user.token = jwt.sign(user.email+Date.now(), "testtoken");//should change later
				user.last_login = Date.now();
				user.last_ip = req.ip;

				user.save(function(err){
					if(err) return callback(err);
					return callback(null,user);
				});
			});
		});
	}
));

exports.login = passport.authenticate('basic', {session:false});

//토큰이 있어야만 가능
//단순비교보다 jwt 토큰 해석을 하는쪽으로 나중에 리팩터
exports.tokenRequired = function(req, res, next) {
	var bearerHeader = req.get('Authorization');
	if(bearerHeader){
		var bearer = bearerHeader.split(" ");
		var bearerToken = new Buffer(bearer[1], 'base64').toString('ascii').split(':')[0];
		User.findOne({token:bearerToken}, function(err, user){
			if(err) next(err);
			else if(user){
				if (user.last_ip === req.ip) {
					req.user = user;
					next();
				} else {
					res.status(403).json({
						type:false,
						message:"your logged on from different location, please login again."
					});
				}
			}else{
				res.status(403).json({
					type:false
				});
			}
		});
	}else{
		res.status(403).json({
			type:false
		});
	}
};

//토큰이 없어도 통과
exports.tokenNotRequired = function(req, res, next) {
	var bearerHeader = req.get('Authorization');
	if(bearerHeader){
		var bearer = bearerHeader.split(" ");
		var bearerToken = new Buffer(bearer[1], 'base64').toString('ascii').split(':')[0];
		User.findOne({token:bearerToken}, function(err, user){
			if(err) next(err);
			else if(user){
				if (user.last_ip === req.ip) {
					req.user = user;
					next();
				} else {
					next();
				}
			}else{
				next();
			}
		});
	}else{
		next();
	}
};

exports.admin = function(req, res, next){
	var bearerHeader = req.get('Authorization');
	if(!bearerHeader){
		res.sendStatus(403);
	}else{
		var bearer = bearerHeader.split(" ");
		var extracted = new Buffer(bearer[1], 'base64').toString('ascii').split(':');
		User.findOne({username:extracted[0]}, function(err, user){
			if(err){
				next(err);
			}else if(user){
				user.verifyPassword(extracted[1], function(err, isMatch){
					if(err) {
						return next(err);
					}else if(isMatch && user.is_admin === true){
						console.log(colors.cyan("  ADMIN LOGGED IN: "), colors.cyan(extracted, req.ip));
						req.user = user;
						next();
					}else{
						return res.sendStatus(403);
					}
				});
			}else{
				return res.sendStatus(403);
			}
		});
	}
};