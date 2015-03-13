var app = angular.module("DeveloperApp", []);

app.factory('WebsiteService', function ($http) {
    var findAll = function (callback) {
     $http.get("/rest/website")
    .success(callback);
    }
    var remove = function(_id,callback)
    {
        $http.delete("/rest/website/" + _id)
            .success(callback);
    }
    var create = function (name,callback) {
        $http.post("/rest/website", name)
        .success(callback);
    }
    return {
        create: create,
        findAll: findAll,
        remove:remove
    }
});
app.controller("DeveloperController", function ($scope, $http, WebsiteService) {
    WebsiteService.findAll(function (response) {
        $scope.websites = response;
    });

    $scope.remove = function (_id) {
        WebsiteService.remove(_id, function (response) {
            $scope.websites = response;
        });
    }
    $scope.add = function (name) {
        WebsiteService.create(name,function (response) {
            $scope.websites = response;
        });
    }
});