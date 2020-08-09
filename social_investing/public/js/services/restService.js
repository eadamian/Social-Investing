var socialApp = angular.module('socialApp', []);

socialApp.factory('RestService', function($http) {
    var service = {};
    var urlBase = '';

    service.getRequestify = function() {
        return $http.get(urlBase + '/requestify');
    };


    service.addStock = function (name, numOfShares, avgCost, portId){
        data={
            "averageCost":avgCost,
            "stockTicker":name,
            "numberOfStocks":numOfShares
        }
        return $http({
            url: '/portfolio/addStock/' + portId,
            method: "POST",
            data: data
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {
            return response;
        });
    }

    service.getEverything = function(userId){
        return $http({
            url:'/api/getPortfolioReturn/' + userId,
            method:'GET'
        }).then((res)=>{
            return res;
        }).catch((error)=>{
            console.log("Got Nothing :(");
        });
    };

    service.login = function(emailParam, passwordParam){
        data = {
            email:emailParam,
            password:passwordParam
        }
        return $http({
            url: '/users/userLogin',
            method: "POST",
            data: data
          }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {
            return response;
        });
      }

    service.createUser = function(emailParam, passwordParam, usernameParam){
        data = {
            email:emailParam,
            password:passwordParam,
            username:usernameParam
        }
        return $http({
            url: '/users/createUser',
            method: "POST",
            data: data
        }).then((res)=>{
            console.log("Success");
            res.sendStatus(200);
        }, (err) =>{
            console.log("Error in creating user");
        });
    }

    service.logout = function(){
        return $http('/users/logout');
    }
    return service;
});