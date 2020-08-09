const express = require('express');
const router = express.Router();
const yahooStockPrices = require('yahoo-stock-prices');
// const urlify = require('urlify');
const requestify = require('requestify');
require('dotenv').config();

const firebase = require("firebase");
var db = firebase.firestore();

// get stock price given ticker and date
router.get('/getStockPrice/:ticker/:date', function (req, res, next) {
  // assumes date is in year month day format like 20180320
  const stockTicker = req.params.ticker;
  const date = req.params.date;
  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);
  yahooStockPrices.getHistoricalPrices(month - 1, day - 1, year, month - 1, day, year, stockTicker, '1d', function (err, prices) {
    if (err) {
      console.log(err);
      res.status(500);
      res.send(err);
    } else {
      console.log(prices);
      res.send(prices);
    }
  });
});

router.get('/getPortfolioReturn/:userId', function (req, res, next) {
  const userId = req.params.userId;
  let returnData = {
    "totalPortfolioValue" : {},
    "stockHoldings" : [], // gives value and weight
    "chartValues" : []
  }
  var resultArray = [];
  // get stocks from db
  db.collection("portfolio").where("userId", "==", userId).get().then((results) => {
    results.forEach((resultDoc) => {
      db.collection("portfolio").doc(resultDoc.id).collection("stocks").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data()) {
            resultArray.push(doc.data());
          }
        });

        let url = "https://cloud.iexapis.com/beta/stock/market/batch?symbols=";

        for (let i = 0; i < resultArray.length - 1; i++) {
          url += (resultArray[i].name + ",");
        }
        url += resultArray[resultArray.length - 1].name;
        url += ("&types=quote&range=1y&token=" + process.env.IEX_TOKEN);
        console.log("url is " + url);

        requestify.get(url).then(function (response) {
          // Get the response body
          // get weights
          let weights = {};
          let jsonResponse = response.getBody();
          let totalValue = 0;
          for (let i = 0; i < resultArray.length; i++) {

            let tickerSymbol = resultArray[i].name.toUpperCase();
            console.log("symbol", tickerSymbol);
            let tickerPrice = jsonResponse[tickerSymbol]["quote"]["latestPrice"];
            console.log("price", tickerPrice);
            let numOfShares = resultArray[i].numOfShares;
            let avgCost = resultArray[i].avgCost;
            let value = tickerPrice * resultArray[i].numOfShares;
            totalValue += value;
            console.log("value", value);

            weights[tickerSymbol] = value;
            returnData.stockHoldings.push({
              [tickerSymbol]: {
                "value": value,
                "weight": null,
                "numOfShares": numOfShares,
                "avgCost": avgCost
              }
            });
          }
          returnData.totalPortfolioValue = totalValue;
          //returnData.stockHoldings = weights;
          console.log("weights",weights);
          console.log("job", JSON.stringify(returnData));
          for (let i = 0; i < resultArray.length; i++) {
            let newtickerSymbol = resultArray[i].name.toUpperCase();
            let newCurrentValue = weights[newtickerSymbol];
            let weightValue = newCurrentValue / totalValue;
            weights[newtickerSymbol] = weightValue * 100;
            returnData.stockHoldings[i][newtickerSymbol].weight = weightValue * 100;
          }
          console.log("return data is ", JSON.stringify(returnData));
          console.log("weights", weights);



          let blackRockUrl = "https://www.blackrock.com/tools/hackathon/portfolio-analysis?calculateExposures=true&calculatePerformance=true&graph=resultMap.PORTFOLIOS%5Bportfolios%5Breturns%5BperformanceChart%5D%5D%5D&maximumMonths=12&positions=";
          for (var key in weights) {
            if (weights.hasOwnProperty(key)) {
              console.log(key + " -> " + weights[key]);
              blackRockUrl += (key + "~" + weights[key] + "%7C");
            }
          }
          requestify.get(blackRockUrl).then(function (response) {
            // Get the response body
            console.log(response.getBody());
            let blackRockJSONResponse = response.getBody();
            let performanceChart = blackRockJSONResponse.resultMap.PORTFOLIOS[0].portfolios[0].returns.performanceChart; //.PORTFOLIOS.portfolios[0].performanceChart;
            console.log("PERFROMANCE FJSHLFHF", performanceChart);
            let currentMultiplier = performanceChart[performanceChart.length - 1][1];
            let startBalance = totalValue / currentMultiplier;
            for(let j = 0; j < performanceChart.length; j++) {
              let day = performanceChart[j][0];
              let multiplier = performanceChart[j][1];
              let dayValue = multiplier * startBalance;
              let dateObj = new Date(day);
              let dateFormat = (dateObj.getMonth() + 1) + "/" + (dateObj.getDate()) + "/" + (dateObj.getFullYear());
              returnData.chartValues.push({
                "label": dateFormat,
                "value": dayValue
              });
            }
            let percentageReturn = 100;
            percentageReturn *= performanceChart[performanceChart.length - 1][1];
            percentageReturn -= 100;
            returnData.percentageReturn = percentageReturn;
            res.send(returnData);
          }).catch(function (error) {
            res.send(error);
          });;
        }).catch(function (error) {
          res.send(error);
        });;
      })
    });
  });
});

function searchSymbol(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].stockHoldings.symbol === nameKey) {
      return myArray[i];
    }
  }
}


// router.get('/getPortfolioReturn/:userId', function (req, res, next) {
//   const userId = req.params.userId;
//   var resultArray = [];
//   // get stocks from db
//   console.log(userId);
//   db.collection("portfolio").where("userId", "==", userId).get().then((results) => {
//     // console.log(results.docs.length);
//     results.forEach((resultDoc) => {
//       db.collection("portfolio").doc(resultDoc.id).collection("stocks").get().then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//           if (doc.data()) {
//             resultArray.push(doc.data());
//           }
//         });

//         let url = "https://cloud.iexapis.com/beta/stock/market/batch?symbols=";

//         for(let i = 0; i < resultArray.length - 1; i++) {
//           url += (resultArray[i].name + ",");
//         }
//         url += resultArray[resultArray.length - 1].name;
//         url += ("&types=quote,chart&range=1y&token=" + process.env.IEX_TOKEN);
//         console.log("url is " + url);

//         requestify.get(url).then(function (response) {
//           // Get the response body
//           console.log(response.getBody());
//           res.send(response.getBody());
//         }).catch(function (error) {
//           res.send(error);
//         });;
//         //res.send(resultArray);
//       })
//     });
//   });


//   // let url = "https://www.blackrock.com/tools/hackathon/portfolio-analysis?calculateExposures=true&calculatePerformance=true&graph=resultMap.PORTFOLIOS[portfolios[returns[performanceChart]]]&positions=AAPL~50%7CGOOGL~50";
//   // requestify.get(url).then(function (response) {
//   //   // Get the response body
//   //   console.log(response.getBody());
//   //   res.send(response.getBody());
//   // }).catch(function (error) {
//   //   res.send(error);
//   // });;

// });


module.exports = router;