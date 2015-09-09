var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var colors = require('colors');
var Schema = mongoose.Schema;

var userSchema  = new Schema({
	email: {type:String, unique:true, required:true},
	password: {type:String, required:true},
	token: {type:String},
	username: {type:String, unique:true, required:true},
	nickname: {type:String, unique:true, required:false},
	pook: {type:Date},
	spec: {
		exp:{type:Number, default:10},
		bamboo:{type:Number, default:0}
	},
	is_admin: {type:Boolean, default:false},
	last_bamboo: {type:Date},
	created_at:{type:Date, default:Date.now},
	last_login:{type:Date},
	last_ip:{type:String}
});

//execute before each user.save() call
userSchema.pre('save', function(callback){
	var user = this;
	//break out if the password hasn't changed
	if (!user.isModified('password')) return callback();

	//password changed so we need to hash it
	bcrypt.genSalt(5, function(err,salt){
		if (err) return callback(err);
		bcrypt.hash(user.password, salt, null, function(err,hash){
			if (err) return callback(err);
			user.password = hash;
			callback();
		});
	});
});

//verify password
userSchema.methods.verifyPassword = function(password, cb){
	bcrypt.compare(password, this.password, function(err, isMatch){
		if(err) return cb(err);
		cb(null, isMatch);
	});
};

// expUp
userSchema.methods.expUp = function(password, cb){
	//포인트 주고 포인트가 일정량이 넘으면 죽창 줌
};


//export mongoose model
var User = mongoose.model('User', userSchema);
module.exports = User;