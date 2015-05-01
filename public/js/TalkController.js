/**
 * Mansoor Ahmed Khan
 *
**/
app.factory('TalkService', function TalkService($http) {
    var edittalk = function (conf, callback) {
        $http.put("/rest/talk/update/" + conf._id, conf)
        .success(callback);
    }
    var findTalk = function (confid, callback) {
        $http.get("/rest/talk/" + confid)
        .success(callback);
    }
    var edituser = function (currentUser, callback) {
        $http.put("/rest/userupdate/" + currentUser._id, currentUser)
        .success(callback);
    }
    var createpayment = function (payment, callback) {
        $http.post("/rest/payment/", payment)
        .success(callback);
    }
    return {
        findTalk: findTalk,
        edittalk: edittalk,
        edituser: edituser,
        createpayment: createpayment
    }
});

app.controller("TalkController", function ($scope, $http, $routeParams, TalkService) {
    var confid = $routeParams.cid;
    var talkid = $routeParams.tid;
    var conf
    $scope.talk = {}
    TalkService.findTalk(confid, function (response) {
        conf = response[0];
        console.log(response)
        for (var i = 0; i < conf.talks.length; i++) {
            var talk = conf.talks[i];

            if (talk._id === talkid) {
                $scope.talk = talk
                break
            }
        }
    });
    $scope.postReview = function () {
        for (var i = 0; i < conf.talks.length; i++) {
            if (conf.talks[i]._id === talkid) {
                conf.talks[i].review.push({ _id: $scope.currentUser._id, name: $scope.currentUser.name, comment: $scope.newcomment });
            }
        }
        TalkService.edittalk(conf, function (response) {
            $scope.talkbyid = response;
        });
    }
    $scope.attend = function (payment) {
        if (payment != null) {
            var flag = false;
            for (var i = 0; i < conf.talks.length; i++) {
                if (conf.talks[i]._id === talkid) {
                    var p = conf.talks[i].P_name
                    var q = conf.talks[i].a_name
                    // var p = conf.talks[i].P_name
                    for (var j = 0; j < p.length; j++) {
                        if (p[j].tp === $scope.currentUser.name) {
                            flag = true;
                            alert("Presenter can not be a attendee of the talk")
                            break;
                        }
                    }
                    for (var x = 0; x < q.length; x++) {
                        if (q[x].ta_name === $scope.currentUser.name) {
                            flag = true;
                            alert("Already registered for the talk")
                            break;
                        }
                    }
                }
            }
            if (!flag) {
                var fag = false;
                var k = 0;
                var z = 0;
                for (var i = 0; i < conf.talks.length; i++) {
                    if (conf.talks[i]._id === talkid) {
                        if (conf.c_attendee.length > 0) {
                            while (k < conf.c_attendee.length) {
                                var r = conf.c_attendee[k];
                                if (r.attendeeName === $scope.currentUser.name) {
                                    alert("ALredy attending conference ");
                                    fag = true;
                                    break;
                                }
                                k++;
                            }
                            if (!fag) {
                                conf.c_attendee.push({ attendeeName: $scope.currentUser.name, _id: $scope.currentUser._id });
                            }
                        } else {
                            conf.c_attendee.push({ attendeeName: $scope.currentUser.name, _id: $scope.currentUser._id });
                        }
                        conf.talks[i].a_name.push({ ta_name: $scope.currentUser.name, _id: $scope.currentUser._id });
                    }
                }
                TalkService.edittalk(conf, function (response) {
                    $scope.talkbyid = response;
                });
                if ($scope.currentUser.c_attended.length > 0) {
                    f = false;
                    while (z < $scope.currentUser.c_attended.length) {
                        var y = $scope.currentUser.c_attended[z];
                        if (y.aName === conf.name) {
                            alert("user table has conference attending");
                            f = true;
                            break;
                        }
                        z++
                    }
                    if (!f) {
                        $scope.currentUser.c_attended.push({ aName: conf.name, _id: conf._id });
                    }
                } else {
                    $scope.currentUser.c_attended.push({ aName: conf.name, _id: conf._id });
                }
                TalkService.edituser($scope.currentUser, function (response) {
                    console.log(response)
                    $scope.user = response;
                });
                payment.userid = $scope.currentUser._id
                payment.talkid = talkid
                TalkService.createpayment(payment, function (response) {
                    console.log(response)
                    $scope.payment = response;
                })
            }
        }
        else {
            alert("Enter details")
        }
    }
});
