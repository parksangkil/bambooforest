var User = require('../models/user');
var Image = require('../models/image');
var multer = require('multer');
var async = require('async');

// api/uploads



exports.uploadImage = [multer({dest:'./public/uploads',
	rename: function (fieldname, filename) {
	    return filename+Date.now();
	},
	onFileUploadStart: function (file) {
	  console.log(file.originalname + ' is starting ...')
	},
	onFileUploadComplete: function (file) {
	  console.log(file.fieldname + ' uploaded to  ' + file.path)
	  var done=true;
	}
}), function(req,res){
	if(done=true){
		async.waterfall([
			function(callback){
				callback(null);
			}
		], function(err, results){
			console.log(req.body);
			console.log(req.files);
			res.json({link:"uploads/"+req.files.file.name});
		});
	}else{
		return res.status(500);
	}
}];

exports.deleteImage = function(req,res){
	console.log("deleteImage");
};