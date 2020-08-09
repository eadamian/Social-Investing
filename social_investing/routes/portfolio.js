var express = require('express');
var router = express.Router();

const firebase = require("firebase");
//Will need to add friends subcollection later
// var userObj = {
//   email: userEmail,
//   username: req.body.username,
//   portfolioId: ''
// };

// array of stock objects

var db = firebase.firestore();

router.post('/addPortfolio', function (req, res, next) {
    var id = req.body.uid;
    var stocks = req.body.stock;
    db.collection("portfolio").add({
            "userId": id
        }).then((docRef) => {
            console.log(docRef.id);
            for (var i = 0; i < stocks.length; i++) {
                db.collection("portfolio").doc(docRef.id).collection("stocks").add(stocks[i]);
            }
            res.sendStatus(200);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
});

router.post('/addStock/:portId', function (req, res, next) {
    var portId = req.params.portId;
    var stock = {
        avgCost: req.body.averageCost,
        name: req.body.stockTicker,
        numOfShares: req.body.numberOfStocks
    };
    db.collection("portfolio").doc(portId).collection("stocks").add(stock).then((docRef) => {
            console.log(docRef.id);
            res.send(200);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            res.send(400);
        });
});

router.delete('/deletePortfolio/:portId', function (req, res, next) {
    var portId = req.params.portId;
    doc.collection("portfolio").doc(portId).delete();
});

router.post('/addComment', function (req, res, next) {

});


module.exports = router;