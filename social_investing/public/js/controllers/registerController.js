var socialApp = angular.module('socialApp');
socialApp.controller('RegisterController',
    ['$scope', 'RestService', function ($scope, RestService) {
        $scope.user = {};
        $scope.error = {
            value: false,
            msg: ""
        };
        $scope.register = function () {
            $scope.error.val = false;
            $scope.error.msg = "";
            if (!$scope.user.username || !$scope.user.email || !$scope.user.password || !$scope.user.repeatPassword) {
                $scope.error.msg = "Please fill out all fields";
                $scope.error.value = true;
                return;
            }
            if ($scope.user.password != $scope.user.repeatPassword) {
                $scope.error.msg = "Passwords do not match";
                $scope.error.value = true;
                return;
            }
            if($scope.user.password.length < 7){
                $scope.error.msg = "Password must be 6+ characters";
                $scope.error.value = true;
                return;
            }
            RestService.createUser($scope.user.email, $scope.user.password, $scope.user.username).then((res) => {
                if (res && res.status == 200) {
                    console.log("Register Success");
                } else {
                    $scope.error.msg = "Register Failed";
                    $scope.error.value = true;
                    return;
                }
            });
        }


    }]);