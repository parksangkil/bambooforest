(function(){
	var app = angular.module('pook')
	app.controller('userCtrl', ['$scope', '$rootScope', '$http', '$routeParams', 'Notification', '$location', function($scope, $rootScope, $http, $routeParams, Notification, $location){
		$http.get("/api/user/"+$routeParams.user_id).success(function(res){
			if(res.type === false){
				Notification.error("Error Occured...");
			}else{
				$scope.userData = res.data;
			}
		});

		$http.get("/api/bestlist").success(function(res){
			console.log(res);
			$scope.bests = res.data;
		});


		$scope.pook = function(){
			var r = confirm("Are you sure?");
			if (r == true) {
				$http.post('/api/user/'+$routeParams.user_id+"/pook").success(function(res){
					if(res.status === "notEnough"){
						console.log("pook error!");
						Notification.error("Not enough Banboo.");
					}else if(res.status === "alreadyPooked"){
						Notification.error("Already been deactivated for a day.");
					// }else if(res.status === "noUser"){
					// 	Notification.error("죽창이 부족합니다.");
					}else if(res.type === "false"){
						Notification.error("Error Occured while reporting the user...");
					}else{
						Notification.success("Successfully Reported. The user will be deactivated for a day.");
						$location.path("/board");
					}
				});
			} else {
				Notification("You cancelled.");
			}

		};

		$scope.modify = false;
		$scope.modifyUserData = function(){
			// console.log("modifyUserData");
			if(!$scope.modify){
				console.log("modify true");
				$scope.modify = true;
			}else{
				console.log("modify false");
				$scope.modify = false;
			}
		}

		$scope.test = $scope.nickname;

		$scope.changeNickname = function(nickname){
			console.log(nickname);
			if(nickname.length > 6 || nickname.indexOf(" ") > 0){
				Notification.warning("Nickname needs to be an alphanumeric combination of less than 6 letters.")
			}else{
				var formData = {
					"nickname": nickname
				}
				$http.put("/api/user/"+$routeParams.user_id, formData).success(function(res){
	                if (res.type === false){
	                    Notification.error("Failed to register a nickname.");
	                }else{
	                    Notification.success("Successfully changed nickname.");
	                    $scope.userData = res.data;
	                    $rootScope.auth.username = res.data.nickname;
	                    $location.path("/user/"+$routeParams.user_id);
	                }
				});
			}
		}
		// $http.get("/api/posts/user/"+$routeParams.user_id).success(function(res){
		// 	if(res.type === false){
		// 		Notification.error("에러가 발생하였습니다");
		// 	}else{
		// 		$scope.posts = res.data;
		// 	}
		// });
	}]);
})();