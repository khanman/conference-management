var app = angular.module("DeveloperApp", []);
app.controller("DeveloperController", function ($scope,$http) {
    $http.get("/rest/website")
    .success(function (response) {
        $scope.websites = response;
    });
    $scope.remove = function (_id) {
        $http.delete("/rest/website/" + _id)
         .success(function (response) {
             $scope.websites = response;
         });
    }
    $scope.add = function (name) {
        $http.post("/rest/website", name)         
        .success(function (response) {
            $scope.websites = response;
            });
    }
    //$scope.remove = function (index) {
    //    console.log(index);
    //  $http.delete("/rest/dev/" + index)
    //   .success(function (response) {
    //        $scope.dev = response;
    //    });
    //}
    
    //$scope.select = function ($index) {
    //    $scope.selectedIndex = $index;
    //    $scope.applications = $scope.dev[$index].apps;
 
    //}
});