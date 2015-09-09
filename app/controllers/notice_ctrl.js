'use strict';

var async = require('async');
var colors = require('colors');

var Notice = require('../models/notice');
var User = require('../models/user');

//utils
function toUnixTime(timeStamp){
	return (new Date(timeStamp).getTime() / 1000).toFixed(0);
}


//indexOf는 왜 아닐때는 -1을 주는가 심각한 고민
exports.list = function(req,res){
	Notice.find()
		.limit(3)
		.sort({id:-1})
		.exec(function(err, notices){
			var data = notices.map(function(notice){
				return {
					_id:notice.id,
					title:notice.title,
					author:{
						user_id:notice.author.user_id,
						username:notice.author.username
					}
				}
			});
			return res.json({
				type:true,
				data:notices
			});
		});	
};


//api/notice/:notice_id
exports.detail = function(req,res){
	Notice.findById(req.params.notice_id, function(err, notice){
		if(err){
			return res.json({
				type:false,
				message:"couldn't find the notice"
			});
		}else{
			return res.json({
				type:true,
				data:{
					_id:notice.id,
					title:notice.title,
					author:notice.author,
					content:notice.content,
					created_at:notice.created_at,
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
		var notice = new Notice({
			title: req.body.title,
			content: req.body.content,
			author:{
				user_id: req.user.id,
				username: req.user.username
			}
		});
		notice.save(function(err, notice){
			if(err){console.log(err);}
			else{
				return res.json({
					type:true,
					messsage:"notice successfully created",
					data:{
						notice_id:notice.id,
						title:notice.title
					}
				});								
			}
		});
	}
};