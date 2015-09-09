 (function(){

'use strict';
 
/* Controllers */
 var app = angular.module('bambooforest');


    // FROALA 

    // text write control
    app.controller('writeCtrl',["$scope", "$http", "$location", "Notification", function($scope, $http, $location, Notification){
        //title나중에 작업하기
        // $scope.addNewPost = function(){
        //  $scope.newPost.id = $scope.posts.length +1;
        //  $scope.newPost.author
        // };
        $http.get("/api/bestlist").success(function(res){
            console.log(res);
            $scope.bests = res.data;
        });       

        // froala
        $scope.options={
            key:'8lrqtC7bd==',
            paceholder : 'My Placeholder',
            language: 'ko',
            inlineMode:false,
            height: '370',
            placeholder: 'You can write your post from here...',
            imageUploadURL: '/api/upload/images',
            imageDeleteURL: '/api/upload/images/delete',
            buttons: ['fontSize','sep', 'bold', 'italic', 'underline','color','insertImage','insertVideo','html']
        };
        $scope.froalaAction = function(action){
            $scope.options.froala(action);
        };
        $scope.onPaste = function(e, editor, html){
            return 'Hijacked' + html;
        };
        $scope.onEvent = function(e, editor, a, b){
            console.log('onEvent', e.namespace, a, b);
        };
        $scope.afterRemoveImage = function(e, editor, img){
            console.log('remove image');
            $scope.options.imageDeleteParams = {src: img.attr('src')};
            $scope.deleteImage(img);
        };

        // $scope.loadTags = function(query) {
        //     console.log("test");
        //      // return $http.get('/api/tags' + query);
        // };

        //submit control
        $scope.title = "";
        $scope.content = "";
        $scope.tags = [];
        $scope.submit = function(){
            if($scope.title <= 1){
                Notification.warning("Enter a Title.");
            }else if($scope.content <= 5){
                Notification.warning("Content cannot be empty.");
            }else if(!$scope.tags || $scope.tags.length === 0){
                Notification.warning("You have to have at least one tag.");
            }else if($scope.tags.legnth <= 5){
                Notification.warning("You need to have more points to put more tags.");
            }else if($scope.title > 30){
                Notification.warning("The title is too long.")
            }else{
                var formData = {
                    "title" : $scope.title,
                    "content" : $scope.content,
                    "tags" : $scope.tags
                }
                $http.post('/api/posts', formData).success(function(res){
                    if (res.type === false){
                        Notification.error("Failed to register a post.");
                    }else{
                        Notification.success("Successfully registered a post.");
                        $location.path("/board");
                    }
                });                    
            }

        }
    }]);

})();