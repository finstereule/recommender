var express = require('express');
var router = express.Router();
const db_connect = require('../db_connect');
var mongoose = require('mongoose');
var cors = require('cors');
var jwt = require('express-jwt');
require('../models/products');
var Product = mongoose.model('Product');


// the GET "books" API endpoint
router.get('/', function (req, res) {

    Product.find({}, function (err, products) {
        var productList = [];
        products.forEach(function (product) {
            productList.push({"id": product._id, "title": product.itemTitle, "image": product.itemImage, "description": product.itemDescription,
                "link": product.itemLink, "price": product.itemPrice});
        });
        res.send(productList);
    });
});

var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentification');
var LaR = require('../controllers/likes');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

router.post('/saveLike', LaR.saveLike);
router.post('/deleteLike', LaR.deleteLike);
router.get('/favourites', LaR.getFavourites);
router.get('/favouriteIds', LaR.getFavouriteIds);
router.get('/recommendations', LaR.getRecommendations);
router.get('/popular', LaR.getPopular);

module.exports = router;