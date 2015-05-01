/**
 * Mansoor Ahmed Khan
 *
**/
app.factory('SecureService', function SecureService($rootScope, $http, $routeParams, $location) {
    var login = function (user, callback) {
        console.log(user);
        $http.post("/login", user)
        .success(function (user) {
            $rootScope.currentUser = user;
            callback(user);
        });
    }
    var logout = function (callback) {
        $http.post("/logout")
        .success(function () {
            $rootScope.currentUser = null;
            callback();
        });
    }
    var findAll = function (callback) {
        $http.get("/login")
        .success(callback);
    }
    return {
        findAll: findAll,
        login: login,
        logout: logout
    }
});

app.controller("LoginController", function ($rootScope, $scope, $http, $routeParams, $location, SecureService) {
    $scope.login = function (user) {
        SecureService.login(user, function (response) {           
            $location.url('/profile');
        });
    }

    SecureService.findAll(function (response) {
        $scope.use = response;
    });

});
app.controller("LogoutController", function ($scope, $http, $routeParams, $location, SecureService) {
    $scope.logout = function () {
        SecureService.logout(function (response) {
            $location.url('/home');
        });
    }
});
