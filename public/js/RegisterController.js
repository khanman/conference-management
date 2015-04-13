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
app.controller("RegisterController", function ($rootScope, $scope, $http, $routeParams, $location, UserService) {
    UserService.finduser(function (response) {
        $scope.user = response;
    });
    $scope.papers = []

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