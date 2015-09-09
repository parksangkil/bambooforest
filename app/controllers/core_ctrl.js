exports.index = function(req,res){
	return res.render('index');
};
exports.partials = function(req,res){
	var name = req.params.name;
	return res.render('partials/' + name)
};

exports.info = function(req,res){
	var params = {
		"HTTP Status":[
			"200 - Ok",
			"201 - Created",
			"304 - Not Modified",
			"400 - Bad Request",
			"404 - Not Found",
			"403 - Forbidden",
			"500 - Internal Server Error"
		],
		"version":"0.0.1"
	};
	return res.send(params);
};