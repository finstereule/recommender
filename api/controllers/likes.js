var mongoose = require('mongoose');
var likes = require('../models/likes');
var User = mongoose.model('User');
var Like = mongoose.model('Like');
var Product = mongoose.model('Product');
var async = require("async");
var jaccard = require('jaccard');
var Q = require('q');
const { performance } = require('perf_hooks');

module.exports.saveLike = function(req, res) {
    var like;
    like = new Like({
        itemId: req.body.itemId,
        itemTitle: req.body.itemTitle,
        itemImage: req.body.itemImage,
        itemDescription: req.body.itemDescription,
        userId: req.body.userId
    });

    like.save(function(err) {
        res.status(200);
        if (err) return(err);
    });

};

module.exports.deleteLike = function(req, res) {
    Like.remove({itemId: req.body.itemId, userId: req.body.userId}).exec()
        .then(result => {
            console.log("deleted");
            res.status(200)});
};

module.exports.getFavourites = function(req, res) {
    Like.find({userId: req.query.details}, function(err,docs){
        var favList = [];
        docs.forEach(function (product) {
            favList.push({"id": product.itemId, "title": product.itemTitle, "image": product.itemImage, "description": product.itemDescription,
                "link": product.itemLink, "price": product.itemPrice});
        });
        res.send(favList);
    });
}

module.exports.getFavouriteIds = function(req, res) {
    Like.find({userId: req.query.details}, function(err,docs){
        var favIdList = [];
        docs.forEach(function (product) {
            favIdList.push({"id": product.itemId});
        });
        //console.log('favIds: '+ JSON.stringify(favIdList));
        res.send(favIdList);
    });
}

function getFavs(userID){
    var promise = Like.find({userId: userID}).exec();
    return promise;
}

module.exports.getPopular = function(req, res){
    var promise = getFavs(req.query.details);    //liked items
    promise.then(function(favItems) {

        var favList = [];
        favItems.forEach(function (val) {
            favList.push(val.itemId);     //array of favourite items
        });

        var tempPopular = [];
                    Like.find().exec().then(function (allLikes) {
                        allLikes.forEach(function (val) {
                            // console.log(val.itemId);
                            if (!(tempPopular.includes(val.itemId)) && !(favList.includes(val.itemId))) {
                                tempPopular.push(val.itemId);
                            }
                        });

                       var popular = [];
                        var obj = {};
                        tempPopular.forEach(function (val) {
                            //console.log(allLikes.filter(item => item.itemId === val).length);
                            obj['itemId'] = val;
                            obj['occurrence'] = allLikes.filter(item => item.itemId === val).length;
                            popular.push(obj);
                            obj = {};
                        });
                        popular.sort((a, b) => parseFloat(a.occurrence) - parseFloat(b.occurrence)).reverse();  //сортування за кількістю появ в базі даних

                        var popularIds = [];
                        popular.forEach(function (val) {
                            popularIds.push(val.itemId);
                        });

                        Product.find({_id: {$in: popularIds}}).exec().then(function (val) {  //getting popular books to send
                            var recommendations = [];
                            val.forEach(function (product) {
                                recommendations.push({
                                    "id": product._id,
                                    "title": product.itemTitle,
                                    "image": product.itemImage,
                                    "description": product.itemDescription,
                                    "link": product.itemLink,
                                    "price": product.itemPrice
                                });
                            });

                            if (recommendations.length > 12){    //fixing length
                                recommendations = recommendations.slice(recommendations.length - 12);
                            }

                            res.send(recommendations);
                        });
                    });

    });
}


module.exports.getRecommendations = function(req, res)
{
    var t0 = performance.now();
    var promise = getFavs(req.query.details);    //liked items

    promise.then(function(favItems){

        var favList = [];
        favItems.forEach(function (val) {
            favList.push(val.itemId);     //array of favourite items
        });
       // console.log('favItems:' + favList);
        var promise = Like.find({itemId: {$in: favList}}).exec();    // find users, that liked the same items
        promise.then(function(simUsers){

             var simUserList = [];
            simUsers.map(like => {       //id of similar users with no repeat
                if (like.userId != req.query.details && !(simUserList.includes(like.userId))) {
                simUserList.push(like.userId);
                }
            });
//            console.log("similarUsers: " + simUserList);
            var promise = Like.find({userId: {$in: simUserList}}).exec();   //favItems of similar users
            promise.then(function(items){
            var simItems = [];
                items.map(like => {
                    if (like.userId != req.query.details && !(simItems.includes(like.userId))) {
                        var obj = {};
                        obj.userId = like.userId;
                        obj.itemId = like.itemId;
                        simItems.push(obj);
                    }
                });

            var users = {};      //changing appearance of documents array to {userID: 111111, userFavs: [bookID, bookID, bookID]}
            for (var i = 0; i < simItems.length; i++) {
                var userId = simItems[i].userId;
                if (!users[userId]) {
                    users[userId] = [];
                }
                users[userId].push(simItems[i].itemId);
            }
            simItems = [];
            for (var userId in users) {
                simItems.push({userId: userId, itemId: users[userId]});
            }

            simItems.forEach(function(val){     //calculate prediction value for each book
                val.like = ((jaccard.index(favList, val.itemId).toFixed(2))/simItems.length).toFixed(2);
               // simItems.push(obj);
            });
            simItems.sort((a, b) => parseFloat(a.like) - parseFloat(b.like)).reverse();  //sorting
                console.log("My UserID: " + req.query.details);
                console.log("My favourites: " + favList);
                console.log("Similarity with users: " + JSON.stringify(simItems));

            var predictionIds = [];
            simItems.forEach(function (val) {   //deleting already liked items
                val.itemId.diff(favList).forEach(function (val2) {
                    predictionIds.push(val2);
                });
            });

           // console.log("favItems: " + favList);
          //  console.log("prediction: " + predictionIds);

                    Product.find({_id: {$in: predictionIds}}).exec().then(function (val) {  //getting prediction books to send
                       // console.log(val);
                        var recommendations = [];
                        val.forEach(function (product) {
                            recommendations.push({
                                "id": product._id,
                                "title": product.itemTitle,
                                "image": product.itemImage,
                                "description": product.itemDescription,
                                "link": product.itemLink,
                                "price": product.itemPrice
                            });
                        });

                        if (recommendations.length > 12){    //fixing length
                            recommendations = recommendations.slice(recommendations.length - 12);
                        }
                        var t1 = performance.now();
                        console.log('Took', (t1 - t0).toFixed(2), 'milliseconds to generate recommendations');
                        res.send(recommendations);
                    });
        });
    });

});
}

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};