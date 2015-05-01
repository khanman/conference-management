/**
 * Mansoor Ahmed Khan
 *
**/
app.factory('AdminTalkService', function ($http) {
    var edittalk = function (conf, callback) {
        $http.put("/rest/talk/update/" + conf._id, conf)
        .success(callback);
    }
    var edituser = function (user, callback) {
        $http.put("/rest/user/update/" + user._id, user)
        .success(callback);
    }
    var findtalk = function (confid, callback) {
        $http.get("/rest/admin/talk/" + confid)
        .success(callback);
    }
    var findUserAll = function (callback) {
        $http.get("/rest/users/")
        .success(callback);
    }
    return {
        findtalk: findtalk,
        edittalk: edittalk,
        findUserAll: findUserAll,
        edituser: edituser
    }
});
app.controller("AdminTalkController", function ($scope, $http, $routeParams, AdminTalkService) {
    var confid = $routeParams.cid;
    var talkid = $routeParams.tid;
    var conf
    var user
    $scope.talk = []
    AdminTalkService.findtalk(confid, function (response) {
        conf = response[0];
        for (var i = 0; i < conf.talks.length; i++) {
            var talk = conf.talks[i];

            if (talk._id === talkid) {
                $scope.talk = talk
                break
            }
        }
    });
    var finduser = function (userid) {
        for (var i = 0; i < $scope.user.length; i++) {
            if ($scope.user[i]._id === userid) {
                return $scope.user[i]
            }
        }
        return null;
    }
    $scope.updatetalk = function () {
        var flag = false;
        var k = 0;
        var user = finduser($scope.myselect);
        for (var i = 0; i < conf.talks.length; i++) {
            if (conf.talks[i]._id === talkid) {
                var p = conf.talks[i].P_name
                //var q = conf.c_attendee
                for (var j = 0; j < p.length; j++) {
                    if (p[j].tp === user.name) {
                        flag = true;
                        alert("Already presenting")
                        break;
                    }
                }
                if (conf.c_attendee.length > 0) {
                    while (k < conf.c_attendee.length) {
                        var r = conf.c_attendee[k];
                        if (r.attendeeName === user.name) {
                            alert("ALredy attending conference ");
                            fag = true;
                            break;
                        }
                        k++;
                    }
                    if (!fag) {
                        conf.c_attendee.push({ attendeeName: user.name, _id: user._id });
                    }
                }
            }
        }
        if (!flag) {
            for (var i = 0; i < conf.talks.length; i++) {
                if (conf.talks[i]._id === talkid) {

                    if (user) {
                        conf.talks[i].P_name.push({ tp: user.name, _id: user._id });
                    }
                }
            }
        }
        AdminTalkService.edittalk(conf, function (response) {
            $scope.talkbyid = response;
        });

        var flag = false;
        for (var m = 0; m < $scope.user.length; m++) {
            if ($scope.user[m]._id === user._id) {
                var c = $scope.user[m].talk_presented;
                for (var i = 0; i < c.length; i++) {
                    if (c[i].talkname === $scope.talk.tname) {
                        flag = true;
                        alert("same talkname")
                        break;
                    }
                }
            }
        }
        if (!flag) {
            user.talk_presented.push({ talkname: $scope.talk.tname, _id: talkid, desc: $scope.talk.desc })
        }
        var atcon = false;
        for (var n = 0; n < $scope.user.length; n++) {
            if ($scope.user[n]._id === user._id) {
                var d = $scope.user[n].c_Presented
                for (var i = 0; i < d.length; i++) {
                    if (d[i].pName === conf.name) {
                        atcon = true;
                        alert(" same conference name")
                        break;
                    }
                }
            }
        }
        if (!flag) {
            user.c_Presented.push({ pName: conf.name, _id: confid })
        }
        AdminTalkService.edituser(user, function (response) {
            $scope.talkbyid = response;
        });
    }
    AdminTalkService.findUserAll(function (response) {
        console.log(response)
        $scope.user = response;
    });
});