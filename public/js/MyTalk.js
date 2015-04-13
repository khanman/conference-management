app.factory('MyTalkService', function ($http) {
    var findConf = function (callback) {
        $http.get("/rest/conference")
        .success(callback);
    }
    var edittalk = function (confer, callback) {
        $http.put("/rest/talks/update/" + confer._id, confer)
        .success(callback);
    }
    return {
        edittalk: edittalk,
        findConf: findConf
    };
});
app.controller("MyTalkController", function ($scope, $http, $routeParams, MyTalkService) {
    var talkid = $routeParams.myid;
    var confer

    MyTalkService.findConf(function (response) {
        $scope.conf = response;
        findtalk(talkid);
    });
    var findtalk = function (talkid) {
        for (var j = 0; j < $scope.conf.length; j++) {
            for (var i = 0; i < $scope.conf[j].talks.length; i++) {
                if ($scope.conf[j].talks[i]._id === talkid) {
                    console.log($scope.talk)
                    $scope.talk = $scope.conf[j].talks[i]
                    $scope.confer = $scope.conf[j]
                    break;
                }
            }
        }
    }

    $scope.updatetalk = function () {
        for (var j = 0; j < $scope.conf.length; j++) {
            for (var i = 0; i < $scope.conf[j].talks.length; i++) {
                if ($scope.conf[j].talks[i]._id === talkid) {
                    $scope.talk = $scope.conf[j].talks[i].slides.push({ name: $scope.name, url: $scope.url });
                    $scope.confer = $scope.conf[j]
                    break;
                };
            }
        }
        MyTalkService.edittalk($scope.confer, function (response) {
            for (var j = 0; j < response.length; j++) {
                for (var i = 0; i < response[j].talks.length; i++) {
                    if (response[j].talks[i]._id === talkid) {
                        $scope.talk = response[j].talks[i];
                        break;
                    }
                }
            }
        }
      )
    };
});
