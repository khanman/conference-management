app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl, callback) {
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
        .success(callback);
    }
}]);



app.factory('ProfileService', function ProfileService($http, $rootScope, $location) {
    var findUser = function (userid, callback) {
        $http.get("/rest/userprofile/" + userid)
        .success(callback);
    }
    var editUser = function (currentUser, callback) {
        $http.put("/rest/userupdate/" + currentUser._id, currentUser)
        .success(callback);
    }
    var editUsers = function (user, callback) {
        $http.put("/rest/userupdate/" + user._id, user)
        .success(callback);
    }
    return {
        findUser: findUser,
        editUser: editUser,
        editUsers: editUsers
    };
});

app.controller("ProfileController", function ($scope, fileUpload, $http, $rootScope, $routeParams, ProfileService, $location) {
    var userid = $routeParams.id;
    var user;
    var following = [];
    var papers = []

    ProfileService.findUser(userid, function (response) {
        console.log(response)
        $scope.user = response;
    });
    
    $scope.follow = function () {
        var flag = false;
        for (var j = 0; j < $scope.currentUser.following.length; j++) {
            if ($scope.currentUser.following[j].name === $scope.user.name) {
                flag = true;
                alert("Following already")
                break;
            }
        } if (!flag) {
            $scope.currentUser.following.push({ name: $scope.user.name, _id: userid });
            ProfileService.editUser($scope.currentUser, function (response) {
                console.log(response)
                $scope.talkbyid = response;
            });
        }
    }
    $scope.uploadFile = function () {
        var file = $scope.myFile;
        console.log('file is ' + JSON.stringify(file));
        var uploadUrl = "/api/photo";
        fileUpload.uploadFileToUrl(file, uploadUrl, function (response) {
            console.log(response);
            $rootScope.projectImage = response.file.name;
            console.log($rootScope.projectImage);
        });

    };
    $scope.addPathParam = function () {
        $scope.papers.push({ name: "", url: "" });
    };
    $scope.removePathParam = function (index) {
        $scope.papers.splice(index, 1);
    };
    $scope.updateUser = function (user) {
        user.photo = $rootScope.projectImage
        ProfileService.editUsers(user, function (response) {
            $location.url('/profile');
        });
    }
});
