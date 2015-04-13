app.factory('ProfileService', function ProfileService($http) {
    var findUser = function (userid, callback) {
        $http.get("/rest/userprofile/" + userid)
        .success(callback);
    }
    var editUser = function (currentUser, callback) {
        $http.put("/rest/userupdate/" + currentUser._id, currentUser)
        .success(callback);
    }
    //var remove = function (currentUser, user, userid, callback) {
    //    $http.put("/rest/follow/update", currentUser, user, userid)
    //        .success(callback);
    //}
    return {
        findUser: findUser,
        editUser: editUser
        //remove:remove
    };
});

app.controller("ProfileController", function ($scope, $http, $routeParams, ProfileService) {
    var userid = $routeParams.id;
    var user;
    var following = [];
 
    ProfileService.findUser(userid, function (response) {
        console.log(response)
        $scope.user = response;
    });
    //$scope.follow = function () {
    //    $scope.visible = true;
    //    $scope.visible = !$scope.visible;
    //    if ($scope.visible === true) {
    //        $scope.currentUser.following.push({ name: $scope.user.name, _id: userid });
    //        ProfileService.editUser($scope.currentUser, function (response) {
    //            console.log(response)
    //            $scope.talkbyid = response;
    //        });
    //    } else {
    //        $scope.visible = false;
    //        return null
    //    }
    //}
});
