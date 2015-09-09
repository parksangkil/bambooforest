'use strict';

var	core_ctrl = require('../controllers/core_ctrl'),
	user_ctrl = require('../controllers/user_ctrl'),
	tokenRequired = require('../controllers/auth_ctrl').tokenRequired,
	tokenNotRequired = require('../controllers/auth_ctrl').tokenNotRequired,
	login = require('../controllers/auth_ctrl').login,
	admin = require('../controllers/auth_ctrl').admin,
	notice_ctrl = require('../controllers/notice_ctrl'),
	post_ctrl = require('../controllers/post_ctrl'),
	like_ctrl = require('../controllers/like_ctrl'),
	tag_ctrl = require('../controllers/tag_ctrl'),
	upload_ctrl = require('../controllers/upload_ctrl'),
	comment_ctrl = require('../controllers/comment_ctrl'),
	colors = require('colors');


exports.initApp = function(app){

	//TimeStamp
	app.use(function(req,res,next){
		console.log(colors.yellow(Date.now()));
		next();
	});

	// APIs
	app.route('/').get(core_ctrl.index);
	app.route('/partials/:name').get(core_ctrl.partials);

	//api 정보
	app.route('/api/info').get(core_ctrl.info);

	// UPLOAD
	app.route('/api/upload/images')
		.post(upload_ctrl.uploadImage)
		.delete(upload_ctrl.deleteImage);

	// USER 
	app.route('/api/users') 
		.get(admin, user_ctrl.list) //유저리스트
		.post(user_ctrl.signup); //회원가입
	app.route('/api/user/:user_id')
		.get(tokenNotRequired, user_ctrl.details) //유저 디테일
		.put(tokenRequired, user_ctrl.edit);
		// .delete(user_ctrl.delete); //유저 삭제
	app.route('/api/users/signin')
		.post(login, user_ctrl.signin); //유저 로그인
	app.route('/api/users/me')
		.post(tokenRequired, user_ctrl.me); //토큰 로그인
	app.route('/api/user/:user_id/pook')
		.post(tokenRequired, user_ctrl.pook);

	//bamboo
	app.route('/api/bamboo')
		.get(tokenRequired, user_ctrl.bamboo);
	// NOTICE
	app.route('/api/notices')
		.get(notice_ctrl.list)
		.post(admin, notice_ctrl.create);
	app.route('/api/notice/:notice_id')
		.get(notice_ctrl.detail);

	// POST
	app.route('/api/posts')
		.get(post_ctrl.list)
		.post(tokenRequired, post_ctrl.create);
	app.get('/api/posts/:current_id/:next_page', post_ctrl.list);

	//list BEST
	app.get('/api/best', post_ctrl.list);
	app.get('/api/best/:current_id/:next_page', post_ctrl.list);

	//list TAGS
	app.get('/api/tags/:tags', post_ctrl.list);
	app.get('/api/tags/:tags/:current_id/:next_page', post_ctrl.list);

	//list User
	app.get('/api/posts/user/:user_id');
	app.get('/api/posts/user/:user_id/:current_id/:next_page');

	// POST DETAIL
	app.route('/api/post/:post_id')
		.get(tokenNotRequired, post_ctrl.detail)
		.put(tokenRequired, post_ctrl.edit);
	// COMMENT
	app.route('/api/post/:post_id/comments')
		.get(tokenNotRequired, comment_ctrl.list);
	app.route('/api/post/:post_id/comments')
		.post(tokenRequired, comment_ctrl.create);
	app.route('/api/post/:post_id/comments/:comment_id')
		.put(tokenRequired, comment_ctrl.edit);

	// LIKE
	app.route('/api/post/:post_id/likes')
		.get(like_ctrl.list) //나중에 리팩터
		.put(tokenRequired, like_ctrl.likeToggle);

	app.route('/api/post/:post_id/likes')
		.put(tokenRequired, like_ctrl.dislikeToggle);

	//POOK
	app.route('/api/post/:post_id/pook')
		.post(tokenRequired, like_ctrl.pook);

	app.route('/api/tags')
		.get(tag_ctrl.list);

	app.route('/api/taglist')
		.get(tag_ctrl.shortList);
	app.route('/api/bestlist')
		.get(post_ctrl.bestShortList);

	app.route('*').get(core_ctrl.index);

	//https://github.com/jpotts18/mean-stack-relational/blob/master/config/routes.js
	//참고
};