(function(){
	'use strict';
	angular.module('bambooforest', [
		'ngStorage',
		'ngRoute',
		'angular-loading-bar',
		'ui-notification',
		'ngSanitize',
		'froala',
		'ngTagsInput'
	])
	.config(['$routeProvider', '$httpProvider', '$locationProvider', 'NotificationProvider',
		function ($routeProvider, $httpProvider, $locationProvider, NotificationProvider) {

        NotificationProvider.setOptions({
            delay: 5000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'left',
            positionY: 'bottom'
        });

		$routeProvider.
			when('/', {
				templateUrl: 'partials/home',
				controller:'homeCtrl'
			}).
			when('/user/:user_id', {
				templateUrl: 'partials/user',
				controller: 'userCtrl'
			}).
			when('/signup',{
				templateUrl: 'partials/signup',
				controller: 'authCtrl'
			}).
			when('/signin',{
				templateUrl: 'partials/signin',
				controller: 'authCtrl'
			}).
			when('/notices',{
				templateUrl: 'partials/notice',
				controller: 'noticeCtrl'
			}).
			when('/bamboo',{
				templateUrl: 'partials/bamboo',
				controller: 'bambooCtrl'
			}).
			when('/notice/:notice_id',{
				templateUrl: 'partials/noticeRead',
				controller: 'noticeReadCtrl'
			}).
			when('/best',{
				templateUrl: 'partials/board',
				controller: 'bestCtrl'
			}).
			when('/board',{
				templateUrl: 'partials/board',
				controller: 'boardCtrl'
			}).
			when('/write', {
				templateUrl: 'partials/write',
				controller: 'writeCtrl'
			}).
			when('/tags', {
				templateUrl: 'partials/tags',
				controller: 'tagCtrl'
			}).
			when('/posts/tags/:tag_name', {
				templateUrl: 'partials/board',
				controller: 'tagBoardCtrl'
			}).
			when('/post/:post_id',{
				templateUrl: 'partials/read',
				controller: 'readCtrl'
			}).
			when('/TOS',{
				templateUrl: 'partials/tos',
				// controller: ''
			}).
			when('/license',{
				templateUrl: 'partials/license',
				// controller: ''
			}).
			when('/contact',{
				templateUrl: 'partials/contact',
				// controller: ''
			}).
			when('/intro',{
				templateUrl: 'partials/intro',
				// controller: ''
			}).
			otherwise({
				templateUrl: 'partials/404'
			});
			$locationProvider.html5Mode(true);

		$httpProvider.interceptors.push('authInterceptor');
		$httpProvider.interceptors.push('errorInterceptor');
		}
	])
	.factory('authInterceptor', ['$localStorage', 'Base64', function ($localStorage, Base64) {
		return {
			'request': function (config) {
				config.headers = config.headers || {};
				if ($localStorage.token) {
					config.headers.Authorization = "Bearer " + Base64.encode($localStorage.token);
				}
				return config;
			}
		};
	}])
	.factory('errorInterceptor', ["$q", "$injector", "$localStorage", function($q, $injector, $localStorage){
		var notification = null;
		var getNotification = function(){
			if(!notification){
				notification = $injector.get('Notification');
			}
			return notification;
		};
		function responseError(res){
			if (res.status === 401 || res.status === 403) {
				delete $localStorage.token;
				delete $localStorage.username;
				getNotification().error("You are not authorized");
			} else if (res.status === 500) {
				getNotification().error("There is an error in the server.");
			} else if (res.status === 404) {
				$injector.get('$state').transitionTo('404');
			}
			return $q.reject(res);
		};
		return{
			'responseError': responseError
		};
	}]);
})();