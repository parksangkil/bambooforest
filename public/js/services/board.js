// (function(){
// 	'use strict';
// 	var app = angular.module('pook')
// 		app.factory('boardService', ['$http','$scope', 'Notification',  function($http, $scope, Notification){

// 			var pages = function (input){
// 				var list = [];
// 				if (input > 3){
// 					list.push("이전");
// 					var initial = input-2;
// 					var aim = input+3;
// 					for(initial; aim>initial; initial++){
// 						if(initial < 1){
// 							continue;
// 						}
// 						list.push(initial);
// 					}
// 				}else{
// 					// var initial = input;
// 					// var aim = input + 5;
// 					for(var i=1; i<=5; i++){
// 						list.push(i);
// 					}
// 				}
// 				list.push("다음");
// 				return list;
// 			}

// 			return {
// 				postList: function(){
// 					$http.get("/api/posts").success(function(res){
// 						console.log(res.data);
// 						$scope.posts = res.data;
// 						$scope.current_page = res.page;
// 						$scope.pages = pages(Number(res.page));
// 						$scope.first_element = res.data[0]._id;
// 					});
// 				},
// 				paging: function(current_page, next_page){
// 					// console.log(next_page);
// 					if(typeof next_page === "number"){
// 						var skip = next_page - current_page;
// 						$http.get("/api/posts/" + first_element + "/" + skip).success(function(res){
// 							if(res.data.length === 0){
// 								Notification.info("더이상 게시물이 없습니다.");
// 							}else{
// 								console.log(res.data);
// 								$scope.posts = res.data;
// 								$scope.pages = pages(Number(current_page));
// 								first_element = res.data[0]._id;
// 							}
// 						});
// 					}else if(next_page === "다음"){
// 						// current_page++;
// 						// $scope.pages = pages(current_page);
// 						console.log(current_page);
// 						if(current_page < 3){
// 							var skip = 6;
// 						}else{
// 							var skip = 3;
// 						}
// 						$http.get("/api/posts/" + first_element + "/" + skip).success(function(res){
// 							if(res.data.length === 0){
// 								Notification.info("더이상 게시물이 없습니다.");
// 							}else{
// 								console.log(res.data);
// 								$scope.posts = res.data;
// 								$scope.pages = pages(Number(current_page));
// 								current_page = current_page;
// 								first_element = res.data[0]._id;
// 							}
// 						});
// 					}else{
// 						console.log(current_page);
// 						var skip = -3;
// 						$http.get("/api/posts/" + first_element + "/" + skip).success(function(res){
// 							if(res.data.length === 0){
// 								Notification.info("더이상 게시물이 없습니다.");
// 							}else{
// 								console.log(res.data);
// 								$scope.posts = res.data;
// 								$scope.pages = pages(Number(current_page));
// 								current_page = current_page;
// 								first_element = res.data[0]._id;
// 							}
// 						});
// 					}
// 				}
// 			};
// 		}
// 	]);


// })();


