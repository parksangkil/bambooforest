(function(){
'use strict';

var app = angular.module('bambooforest');


	app.controller('readCtrl',["$scope", "$http", "$location", "$routeParams", "$route", "$sce", "Notification",
		function($scope, $http, $location, $routeParams, $route, $sce, Notification){
		
		$http.get("/api/post/" + $routeParams.post_id).success(function(res){
			if(res.type === false){
				Notification.error("There is Error in the ser...ver...");
			}else if(res.status === "pooked"){
				$scope.post = res.data;
				$scope.pooked = true;
				Notification("The post is deactivated.");
			}else{
				$scope.post = res.data;
				$scope.post.content = $sce.trustAsHtml(res.data.content);
				if(!res.data.is_liked){
					$scope.likeStatus = "Like";
				}else{
					$scope.likeStatus = "Liked";
				}
			}
		});


		$scope.like = function(){
			$http.put('/api/post/'+$routeParams.post_id+"/likes").success(function(res){
				if(res.type === false){
					Notification.error("Error Occured...");
				}else{
					if(res.data.is_liked === true){
						Notification.success("You already Liked.");
						$scope.likeStatus = "Liked";
					}else{
						Notification.success("Canceled Like");
						$scope.likeStatus = "Like";
					}
				
				}
			});
		};

		$scope.pook = function(){
			var r = confirm("Are You Sure?");
			if (r == true) {
				$http.post('/api/post/'+$routeParams.post_id+"/pook").success(function(res){
					if(res.status === "notEnough"){
						Notification.error("Not Enough Bamboo");
					}else if(res.type === "false"){
						Notification.error("Error Occured...");
					}else{
						Notification.success("The post will be deactivated and cannot be read until tomorrow");
						$location.path("/board");
					}
				});
			} else {
				Notification("Canceled.");
			}

		};

		$http.get("/api/post/" + $routeParams.post_id +"/comments").success(function(res){
			if(res.type ===false){
				Notification.error("Error Occured...");
			}else{
				$scope.comments = res.data;
			}
		});
		
		$scope.submit = function(){
			if($scope.comment){
				if($scope.comment.length > 500){
					Notification.warning("Too many letters, it has to be less than 500 letters.")
				}else if($scope.comment.length < 5){
					Notification.warning("You have to write more than 6 letters.");
				}else{
					var formData = {
						"content":$scope.comment//.replace(/\r?\n/g, '<br />')
					};
					$http.post('/api/post/'+$routeParams.post_id+"/comments", formData)
						.success(function(res){
							if (res.type === false){
								Notification.error("Error Occured...");
							}else{
								$scope.comment = "";
								$http.get("/api/post/" + $routeParams.post_id +"/comments").success(function(res){
									if(res.type ===false){
										Notification.error("Error Occured...");
									}else{
										$scope.comments = res.data;
									}
								});
							}
					});
				}
			}
		};

		$http.get("/api/bestlist").success(function(res){
			if(res.type ===false){
				Notification.error("Error Occured...");
			}else{
				$scope.bests = res.data;
			}
		});


	}]);
})();