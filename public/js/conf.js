var app = angular.module("ConferenceApp", ["ngRoute","ui.router"]);

app.config(['$routeProvider','$locationProvider','$httpProvider',
  function ($routeProvider, $locationProvider, $httpProvider) {
      $routeProvider.
        when('/home', {
            templateUrl: 'home.html',
            controller: 'SearchController'
        }).
        when('/conference/:id', {
            templateUrl: 'conferencepage.html',
            controller: 'ConferenceController'
        }).
          when('/register', {
              templateUrl: 'register.html',
              controller: 'RegisterController'
          }).
          when('/login', {
              templateUrl: 'login.html',
              controller: 'LoginController'
          }).
          when('/talk/:cid/:tid', {
              templateUrl: 'talk.html',
              controller: 'TalkController'
          }).
          when('/profile', {
              templateUrl: 'profile.html',
              controller: 'ProfileController',
              resolve: {
                  //loggedin : checkLoggedin
              }
          }).
          when('/profile/:id', {
              templateUrl: 'profilepage.html',
              controller: 'ProfileController'
          }).
          when('/Mytalks', {
              templateUrl: 'Mytalks.html'
          }).
          when('/Mytalks/:myid', {
              templateUrl: 'Mytalkupdate.html',
              controller: 'MyTalkController'
          }).
          when('/admin', {
              templateUrl: 'AdminHome.html',
              controller: 'AdminConferenceController'
          }).
          when('/update/:id', {
              templateUrl: 'AdminConference.html',
              controller: 'AdminConferenceController'
          }).
          when('/admintalk/:cid/:tid', {
              templateUrl: 'AdminTalk.html',
              controller: 'AdminTalkController'
          }).
        otherwise({
            redirectTo: '/home'
        });
      $httpProvider
    .interceptors
    .push(function($q, $location)
    {
        return {
            response: function(response)
            { 
                return response;
            },
            responseError: function(response)
            {
                if (response.status === 401)
                    $location.url('/login');
                return $q.reject(response);
            }
        };
    }); 
  }]);

var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer();

    $http.get('/loggedin').success(function (user) {
        $rootScope.errorMessage = null;
        // User is Authenticated
        if (user !== '0') {
            $rootScope.currentUser = user;
            deferred.resolve();
        }
            // User is Not Authenticated
        else {
            $rootScope.errorMessage = 'You need to log in.';
            deferred.reject();
            $location.url('/login');
        }
    });

    return deferred.promise;
};

app.factory('SearchService', function ($http) {

    var search = function (city, callback) {
        $http.get("/rest/search/" + city)
            .success(callback);
    }
    return {
        search: search
    }
});
app.controller("SearchController", function ($scope, $http, SearchService) {
    $scope.searchTitle = function (city) {
        SearchService.search(city, function (response) {
            $scope.conf = response;
        });
    }
});