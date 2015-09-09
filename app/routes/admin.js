'use strict';
var path = require("path");


exports.initAdmin = function(app){

	app.get('/admin',function(req,res){
		var path1 = path.join(__dirname,'../../public/admin', 'index.html')
		console.log(path1);
		return res.sendFile(path1);
	});
};