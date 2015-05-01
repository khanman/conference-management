/**
 * Mansoor Ahmed Khan
 *
**/
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
app.factory('UserService', function ($http, $location, $rootScope) {
    var create = function (users, callback) {
        $http.post("/rest/user", users)
        .success(callback);
    }
    var finduser = function (callback) {
        $http.get("/rest/users/")
        .success(callback);
    }
    return {
        finduser: finduser,
        create: create
    }
});
app.controller("RegisterController", function ($rootScope,fileUpload, $scope, $http, $routeParams, $location, UserService) {
    UserService.finduser(function (response) {
        $scope.user = response;
    });
    $scope.papers = []

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

    $scope.register = function (users) {
        var j = 0;
        var flag = false;
        while (j < $scope.user.length) {
            console.log("J" + j + "Name:" + $scope.user[j].name)
            if ($scope.user[j].name === users.name) {
                flag = true;
                alert("DIfferent Username")
                break;
            }
            j++;
        }
        if (!flag) {
            users.papers = $scope.papers;
            users.photo = $rootScope.projectImage
            UserService.create(users, function (response) {
                if (response != null) {
                    console.log(response)
                    $rootScope.currentUser = response;
                    $location.url("/profile");
                }
            });
        }
    }
    $scope.addPathParam = function () {
        $scope.papers.push({ name: "", url: "" });
    };
    $scope.removePathParam = function (index) {
        $scope.papers.splice(index, 1);
    };
});