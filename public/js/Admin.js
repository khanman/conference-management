
app.factory('AdminService', function ($http) {
    var findAll = function (callback) {
        $http.get("/rest/conference")
        .success(callback);
    }
    var remove = function (_id, callback) {
        $http.delete("/rest/conference/" + _id)
            .success(callback);
    }
    var create = function (cons, callback) {
        $http.post("/rest/conference", cons)
        .success(callback);
    }
    var edit = function (con, _id, callback) {
        $http.put("/rest/conference/update/" + _id, con)
        .success(callback);
    }
    var findConf = function (confid, callback) {
        $http.get("/rest/admin/conference/" + confid)
        .success(callback);
    }
    return {
        create: create,
        findAll: findAll,
        remove: remove,
        edit: edit,
        findConf: findConf
    }
});
app.controller("AdminConferenceController", function ($scope, $http, $routeParams, AdminService) {
    $scope.talks = []
    $scope.sponsor = []
    AdminService.findAll(function (response) {
        $scope.conf = response;
    });

     $scope.addPathParam = function () {
         $scope.talks.push({ tname: ""});
    };
    $scope.removePathParam = function (index) {
        $scope.talks.splice(index, 1);
    };

    $scope.addspoParam = function () {
        $scope.sponsor.push({ name: "", url: "" });
    };
    $scope.removespoParam = function (index) {
        $scope.sponsor.splice(index, 1);
    };

    var confid = $routeParams.id;
    AdminService.findConf(confid, function (response) {
        $scope.confbyid = response;
    });

    $scope.remove = function (_id) {
        AdminService.remove(_id, function (response) {
            $scope.conf = response;
        });
    }
    $scope.add = function (cons) {
        cons.talks = $scope.talks
        cons.sponsor = $scope.sponsor
        AdminService.create(cons, function (response) {
            $scope.conf = response;
        });
    }
    $scope.update = function (con, _id, callback) {
        AdminService.edit(con, _id, function (response) {
            $scope.conf = response
        });
    }
});