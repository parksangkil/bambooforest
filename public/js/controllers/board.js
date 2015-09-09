(function(){
'use strict';
var app = angular.module('bambooforest');


var pages = function(current, total){
	var list = [];
	var pageLimit = 5;
	var upperLimit, lowerLimit;
	var currentPage = lowerLimit = upperLimit = Math.min(current, total);

	for (var b = 1; b < pageLimit && b < total;) {
	    if (lowerLimit > 1 ) {
	        lowerLimit--; b++; 
	    }
	    if (b < pageLimit && upperLimit < total) {
	        upperLimit++; b++; 
	    }
	}

	for (var i = lowerLimit; i <= upperLimit; i++) {
	    if (i == currentPage){
	    	list.push("["+i+"]");
	    }
	    else{
	    	list.push(i);
	    }
	}
	return list;
}

	app.controller('boardCtrl',["$scope", "$http", "Notification", function($scope, $http, Notification){
		$http.get("/api/taglist").success(function(res){
				$scope.tags = res.data;
		});


		$scope.boardTitle = "Multiple Tags"


		var first_element;
		var currentPage;
		$http.get("/api/posts").success(function(res){
			$scope.posts = res.data;
			currentPage = res.currentPage;
			$scope.pages = pages(Number(res.currentPage), Number(res.totalPage));
			first_element = res.data[0]._id;

		});

		$scope.paging = function(page){
			if(typeof page === "number"){
				var skip = page - currentPage;
				$http.get("/api/posts/" + first_element + "/" + skip).success(function(res){
					if(res.data.length === 0){
						Notification.info("No More Posts.");
					}else{
						$scope.posts = res.data;
						$scope.pages = pages(Number(res.currentPage), Number(res.totalPage));
						currentPage = res.currentPage;
						first_element = res.data[0]._id;
					}
				});
			}else if(page === "Next"){
				if(currentPage < 3){
					var skip = 6;
				}else{
					var skip = 3;
				}
				$http.get("/api/posts/" + first_element + "/" + skip).success(function(res){
					if(res.data.length === 0){
						Notification.info("No More Posts.");
					}else{
						$scope.posts = res.data;
						$scope.pages = pages(Number(res.currentPage), Number(res.totalPage));
						currentPage = res.currentPage;
						first_element = res.data[0]._id;
					}
				});
			}else{
				var skip = -3;
				$http.get("/api/posts/" + first_element + "/" + skip).success(function(res){
					if(res.data.length === 0){
						Notification.info("No More Posts.");
					}else{
						$scope.posts = res.data;
						$scope.pages = pages(Number(res.currentPage), Number(res.totalPage));
						currentPage = res.currentPage;
						first_element = res.data[0]._id;
					}
				});
			}
		};

		$http.get("/api/bestlist").success(function(res){
			$scope.bests = res.data;
		});
	}]);

	app.controller('bestCtrl',["$scope", "$http", "Notification", function($scope, $http, Notification){

		$scope.boardTitle = "Popular Posts";
		$scope.best = true;

		var first_element;
		var currentPage;
		$http.get("/api/best").success(function(res){
			$scope.posts = res.data;
			$scope.pages = pages(Number(res.currentPage), Number(res.totalPage));
			first_element = res.data[0]._id;
		});

		$http.get("/api/bestlist").success(function(res){
			$scope.bests = res.data;
		});

		$scope.paging = function(page){
			if(typeof page === "number"){
				var skip = page - currentPage;
				$http.get("/api/best/" + first_element + "/" + skip).success(function(res){
					if(res.data.length === 0){
						Notification.info("No More Posts.");
					}else{
						console.log(res.data);
						$scope.posts = res.data;
						$scope.pages = pages(Number(res.currentPage), Number(res.totalPage));
						currentPage = res.currentPage;
						first_element = res.data[0]._id;
					}
				});
			}else if(page === "Next"){
				if(currentPage < 3){
					var skip = 6;
				}else{
					var skip = 3;
				}
				$http.get("/api/best/" + first_element + "/" + skip).success(function(res){
					if(res.data.length === 0){
						Notification.info("No More Posts");
					}else{
						$scope.posts = res.data;
						$scope.pages = pages(Number(res.currentPage), Number(res.totalPage));
						currentPage = res.currentPage;
						first_element = res.data[0]._id;
					}
				});
			}else{
				var skip = -3;
				$http.get("/api/best/" + first_element + "/" + skip).success(function(res){
					if(res.data.length === 0){
						Notification.info("No More Posts");
					}else{
						$scope.posts = res.data;
						$scope.pages = pages(Number(res.currentPage), Number(res.totalPage));
						currentPage = res.currentPage;
						first_element = res.data[0]._id;
					}
				});
			}
		};

	}]);

	app.controller('tagCtrl',["$scope", "$http", function($scope, $http){
		$http.get("/api/tags").success(function(res){
				$scope.tags = res.data;
		});
	}]);

	app.controller('tagBoardCtrl',["$scope", "$http", "$routeParams", "Notification", function($scope, $http, $routeParams, Notification){
		 $http.get("/api/taglist").success(function(res){
					$scope.tags = res.data;
		 });

		$scope.tagBoardTitle = $routeParams.tag_name

		var first_element;
		var currentPage;
		$http.get("/api/tags/"+$routeParams.tag_name).success(function(res){
			if(res.data.length === 0){
				Notification.warning("There is no more posts.");
			}else{
				$scope.posts = res.data;
				currentPage = res.currentPage;
				$scope.pages = pages(Number(res.currentPage), Number(res.totalPage));
				first_element = res.data[0]._id;
			}
		});

		$http.get("/api/bestlist").success(function(res){
			$scope.bests = res.data;
		});


		$scope.paging = function(page){
			if(typeof page === "number"){
				var skip = page - currentPage;
				$http.get("/api/tags/" +$routeParams.tag_name+"/"+ first_element + "/" + skip).success(function(res){
					if(res.data.length === 0){
						Notification.info("No More Posts");
					}else{
						$scope.posts = res.data;
						$scope.pages = pages(Number(res.currentPage), Number(res.totalPage));
						currentPage = res.currentPage;
						first_element = res.data[0]._id;
					}
				});
			}else if(page === "Next"){
				if(currentPage < 3){
					var skip = 6;
				}else{
					var skip = 3;
				}
				$http.get("/api/tags/" +$routeParams.tag_name+"/"+ first_element + "/" + skip).success(function(res){
					if(res.data.length === 0){
						Notification.info("No More Posts");
					}else{
						$scope.posts = res.data;
						$scope.pages = pages(Number(res.currentPage), Number(res.totalPage));
						currentPage = res.currentPage;
						first_element = res.data[0]._id;
					}
				});
			}else{
				var skip = -3;
				$http.get("/api/tags/" +$routeParams.tag_name+"/" + first_element + "/" + skip).success(function(res){
					if(res.data.length === 0){
						Notification.info("No More Posts");
					}else{
						$scope.posts = res.data;
						$scope.pages = pages(Number(res.currentPage), Number(res.totalPage));
						currentPage = res.currentPage;
						first_element = res.data[0]._id;
					}
				});
			}
		};
	}]);

	app.controller('noticeCtrl',["$scope", "$http", function($scope, $http){
		$scope.boardTitle = "Notice";

		$http.get("/api/notices").success(function(res){
			$scope.notices = res.data;
		});

		$http.get("/api/bestlist").success(function(res){
			$scope.bests = res.data;
		});

	}]);

	app.controller('noticeReadCtrl',["$scope", "$http", "$routeParams", function($scope, $http, $routeParams){
		$http.get("/api/notice/" + $routeParams.notice_id).success(function(res){
			$scope.notice = res.data;
		});

		$http.get("/api/bestlist").success(function(res){
			$scope.bests = res.data;
		});

	}]);

	app.controller('bambooCtrl',["$scope", "$http", "$routeParams", "Notification", function($scope, $http, $routeParams, Notification){
		$http.get("/api/bestlist").success(function(res){
			$scope.bests = res.data;
		});

		$scope.giveMeBamboo = function(){
			$http.get("/api/bamboo").success(function(res){
				if(res.type === false){
					Notification.error("Failed to get a bamboo...");
				}else if(res.status === "failed"){
					Notification.error("Failed to get a bamboo...");
				}else if(res.status === "alreadyDone"){
					Notification.error("You already tried today, try tomorrow");
				}else{
					Notification.success("Success!!!! You earned a bamboo");
				}
			});
		};

	}]);

})();
