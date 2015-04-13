//var app = angular.module("ConferenceApp", []);

app.factory('ConferenceService', function ($http) {
    var findConf = function (confid, callback) {
        $http.get("/rest/conference/" + confid)
        .success(callback);
    }
    var edittalk = function (conf, callback) {
        $http.put("/rest/conf/update/" + conf._id, conf)
        .success(callback);
    }
    return {
        edittalk:edittalk,
        findConf: findConf
    };
});
app.controller("ConferenceController", function ($scope, $http, $routeParams, ConferenceService) {
    var confid = $routeParams.id;
    var conf 
    ConferenceService.findConf(confid, function (response) {
        conf = response[0];
        $scope.conf = response;
    });
    $scope.postReview = function (newcomment) {   
        conf.c_review.push({_id: $scope.currentUser._id, name: $scope.currentUser.name,comment:newcomment});
       ConferenceService.edittalk(conf, function (response) {
           console.log(response)
            $scope.talkbyid = response;
        });
    }
});
