(function(){

'use strict';
 
/* authentication Controllers */
 
var app = angular.module('bambooforest');


String.prototype.isAlphaNumeric = function() {
  var regExp = /^[A-Za-z0-9]+$/;
  return (this.match(regExp));
};
  //injection 안쓰이는것 나중에 수정해야됨

	app.controller('authCtrl',['$http','$rootScope', '$scope', '$localStorage', 'authService','Notification', 
                    function($http, $rootScope, $scope, $localStorage, authService, Notification){
		
    if($localStorage.token){
      authService.me();
    }
    $scope.signin = function(){
			var formData = {
				username: $scope.username,
				password: $scope.password
			};
      authService.signin(formData);
		};
    $scope.signout = function(){
      authService.signout();
    };
    $scope.signup = function(){
      if(!$scope.username){
        Notification.error('Username is invalid.');
      }else if(!$scope.password){
        Notification.error('Password is invalid.');
      }else if(!$scope.confirm){
        Notification.error('Passsword and confirm does not match');
      }else if(!$scope.email){
        Notification.error('Email is not valid');
      }else if(!$scope.username.isAlphaNumeric()){
        Notification.error('Username has to be alphanumeric without space and less than 6 letters.');
      }else if($scope.username > 6){
        Notification.error('Username has to be alphanumeric without space and less than 6 letters.');        
      }else if($scope.confirm != $scope.password){
        Notification.error('Password and confirm does not match');
      }else{
        var formData = {
          username: $scope.username,
          password: $scope.password,
          confirm: $scope.confirm,
          email: $scope.email
        }
        authService.signup(formData);
      }
    };
	}]);
})();