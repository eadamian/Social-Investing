var socialApp = angular.module('socialApp');
socialApp.controller('IndexController',

    ['$scope', 'RestService', function ($scope, RestService) {
      $scope.userId = "QA4Gn8THFCfeSMoaP8j7rCWOLZd2";
      $scope.portId = "E0wBHW75clJVSB9m92h9";

    $scope.addModal = new ShowDataToModal();
    $scope.isStockPage = false;
    $scope.friendsPage = false;
    $scope.indexPage = true;
    $scope.browserPage = false;

    $scope.avgCost = 0;
    $scope.name = "";
    $scope.numOfShares = 0;
    $scope.equity = 0;
    $scope.weight = 0;

    //everything function
    $scope.totalPortfolioValue = 0.00;
    $scope.numberOfCompanies = 0;
    $scope.labelArray = [];
    $scope.valuesArray = [];
    $scope.percentageReturn = 0;

    // TODO: fix this nasty eventually
    $scope.returnStyle = function (value) {
      return parseFloat($scope.percentageReturn) >= 0 ? {
        color: 'green'
      } : {
        color: 'red'
      }
    }

    $scope.changeToBrowser = function(){
      $scope.isStockPage = false;
      $scope.friendsPage = false;
      $scope.indexPage = false;
      $scope.browserPage = true;
    }

    $scope.changeToIndex = function () {
      $scope.isStockPage = false;
      $scope.friendsPage = false;
      $scope.browserPage = false;
      $scope.indexPage = true;
    }
    $scope.changeToStock = function () {
      $scope.indexPage = false;
      $scope.friendsPage = false;
      $scope.browserPage = false;
      $scope.isStockPage = true;
    }
    $scope.changeToFriends = function () {
      $scope.indexPage = false;
      $scope.isStockPage = false;
      $scope.browserPage = false;
      $scope.friendsPage = true;
    }

    $scope.formatNumber = function (i) {
      return Math.round(i * 100) / 100;
    }

    $scope.stockSearch = "";
    $scope.searchStocks = ["googl", "fb", "blk", "mfst"];

    $scope.portfolioStocks = [];

    $scope.data = {}
    $scope.getEverything = function () {
      RestService.getEverything($scope.userId).then((res) => {
        $scope.data = res.data;
        console.log('data', res.data);
        $scope.totalPortfolioValue = res.data.totalPortfolioValue;
        $scope.numberOfCompanies = res.data.stockHoldings.length;
        for (var i = 0; i < res.data.stockHoldings.length; i++) {
          var tempObj = res.data.stockHoldings[i];
          for (var key in tempObj) {
            var temp2Obj = {}
            temp2Obj.name = key;
            temp2Obj.equity = tempObj[key].value;
            temp2Obj.weight = tempObj[key].weight;
            temp2Obj.avgCost = tempObj[key].avgCost;
            temp2Obj.numOfShares = tempObj[key].numOfShares;
            $scope.portfolioStocks.push(temp2Obj);
          }
        }
        for (var i = 0; i < res.data.chartValues.length; i +=5) { // values of portfolio every 5 days
          var temp = res.data.chartValues[i];
          $scope.labelArray.push(temp.label);
          $scope.valuesArray.push(temp.value);
        }
        $scope.percentageReturn = res.data.percentageReturn;
        console.log("labelArray", $scope.labelArray);
        console.log("valuesArray", $scope.valuesArray);
        // Set new default font family and font color to mimic Bootstrap's default styling
        Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.global.defaultFontColor = '#858796';

        function number_format(number, decimals, dec_point, thousands_sep) {
          // *     example: number_format(1234.56, 2, ',', ' ');
          // *     return: '1 234,56'
          number = (number + '').replace(',', '').replace(' ', '');
          var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
              var k = Math.pow(10, prec);
              return '' + Math.round(n * k) / k;
            };
          // Fix for IE parseFloat(0.55).toFixed(0) = 0;
          s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
          if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
          }
          if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
          }
          return s.join(dec);
        }

        // Area Chart Example
        var ctx = document.getElementById("myAreaChart");
        var myLineChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: $scope.labelArray,
            datasets: [{
              label: "Earnings",
              lineTension: 0.3,
              backgroundColor: "rgba(78, 115, 223, 0.05)",
              borderColor: "rgba(78, 115, 223, 1)",
              pointRadius: 3,
              pointBackgroundColor: "rgba(78, 115, 223, 1)",
              pointBorderColor: "rgba(78, 115, 223, 1)",
              pointHoverRadius: 3,
              pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
              pointHoverBorderColor: "rgba(78, 115, 223, 1)",
              pointHitRadius: 10,
              pointBorderWidth: 2,
              data: $scope.valuesArray
            }],
          },
          options: {
            maintainAspectRatio: false,
            layout: {
              padding: {
                left: 10,
                right: 25,
                top: 25,
                bottom: 0
              }
            },
            scales: {
              xAxes: [{
                time: {
                  unit: 'date'
                },
                gridLines: {
                  display: false,
                  drawBorder: false
                },
                ticks: {
                  maxTicksLimit: 7
                }
              }],
              yAxes: [{
                ticks: {
                  maxTicksLimit: 5,
                  padding: 10,
                  // Include a dollar sign in the ticks
                  callback: function (value, index, values) {
                    return '$' + number_format(value);
                  }
                },
                gridLines: {
                  color: "rgb(234, 236, 244)",
                  zeroLineColor: "rgb(234, 236, 244)",
                  drawBorder: false,
                  borderDash: [2],
                  zeroLineBorderDash: [2]
                }
              }],
            },
            legend: {
              display: false
            },
            tooltips: {
              backgroundColor: "rgb(255,255,255)",
              bodyFontColor: "#858796",
              titleMarginBottom: 10,
              titleFontColor: '#6e707e',
              titleFontSize: 14,
              borderColor: '#dddfeb',
              borderWidth: 1,
              xPadding: 15,
              yPadding: 15,
              displayColors: false,
              intersect: false,
              mode: 'index',
              caretPadding: 10,
              callbacks: {
                label: function (tooltipItem, chart) {
                  var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                  return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
                }
              }
            }
          }
        })
      }).catch((error) => {
        console.log(error);
      });
    };

    $scope.getEverything();

    $scope.stockFilter = function (item) {
      return item.includes($scope.stockSearch);
    };

    $scope.addStock = function () {
      console.log($scope.name, $scope.numOfShares, $scope.avgCost);
    }

      $scope.addStock = function (curName, curNumOfShares, curAvgCost) {
        RestService.addStock(curName,curNumOfShares,curAvgCost, $scope.portId).then((res)=>{
          console.log("added stock");
           $scope.portfolioStocks.push({
            name:curName,
            numOfShares:curNumOfShares,
            avgCost:curAvgCost
          });

          $scope.addModal.close();
        }).catch((err)=>{
          $scope.addModal.close();
          console.log(err);
        });
      }


  }]);
var ShowDataToModal = function () {
  this.visible = false;
};
ShowDataToModal.prototype.open = function (data) {
  this.data = data;
  this.visible = true;
};
ShowDataToModal.prototype.openAdd = function () {
  this.visible = true;
};
ShowDataToModal.prototype.close = function () {
  this.visible = false;
};
ShowDataToModal.prototype.openSettings = function (user_id) {
  this.user_id = user_id;
  this.visible = true;
};

socialApp.directive('addModal', [function () {
  return {
    restrict: 'E',
    scope: {
      model: '=',
      avgCost: '=',
      name: '=',
      numOfShares: '='
    },
    link: function (scope, element, attributes) {
      scope.$watch('model.visible', function (newValue) {
        var modalElement = element.find('.modal');
        modalElement.modal(newValue ? 'show' : 'hide');
      });

      element.on('shown.bs.modal', function () {
        scope.$evalAsync(function () {
          scope.model.visible = true;
          scope.avgCost = 0;
          scope.name = "";
          scope.numOfShares = 0;
          element.find('.modal').find('form').trigger('reset');
        });
      });

      element.on('hidden.bs.modal', function () {
        scope.$evalAsync(function () {
          scope.model.visible = false;
        });
      });

    },
    templateUrl: 'addModal.html',
  };
}]);