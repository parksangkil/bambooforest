(function(){

'use strict';
 
/* authentication Controllers */
 
var app = angular.module('pook');

//injection 안쓰이는것 나중에 수정해야됨
	app.controller('homeCtrl',['$scope','$http', '$localStorage', 'Notification', 
		function($scope,$http,$localStorage,Notification){
			if($localStorage.token){
			  Notification.success("Welcome");
			}

			$http.get("/api/best").success(function(res){
				$scope.bests = res.data;
			});
	}]);
})();