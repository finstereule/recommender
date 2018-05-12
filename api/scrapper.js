const express = require('express');
//var cron = require('node-cron');
var mongoose = require('mongoose');
const db_connect = require('./db_connect');

// cron.schedule('* * * * Saturday', function(){
const osmosis = require('osmosis');

const fs = require('fs');

var conn = mongoose.connection;

osmosis
    .get('http://www.yakaboo.ua/knigi/komp-juternaja-literatura.html')
   // .paginate('.pages-nav-next a.next')
    .paginate('.block-categories-list ul li a[href]')
    .delay(1000)
    .find('ul.products-grid')
    .set('itemLink', 'tr.name a@href')
    .follow('.item .content a[href]')
    .set({
        'itemTitle': 'h1',
        'itemImage': '.product-image img@src',
        'itemDescription': '.unit__content .content__text',
        'itemPrice': '.price-box .price'
    })
    .log(console.log)
    .data(function(data) {
        console.log(data);
        conn.collection('products').insert(data);
    });

//}