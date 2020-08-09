var socialApp = angular.module('socialApp');
socialApp.controller('LoginController',
    ['$scope', 'RestService', function ($scope, RestService) {
        $scope.user = {};
        $scope.login = function () {
            RestService.login($scope.user.email, $scope.user.password).then((res)=>{
                if(res.status == 200){
                    console.log("Loggin Success");
                }else{
                    console.log("Login Fail");
                }
            });
        }

        $scope.logout = function(){
            RestService.logout().then((res)=>{
                if(status == 200){
                    console.log("logout successful");
                }else{
                    console.log("logout failed");
                }
            });
        }
    }]);