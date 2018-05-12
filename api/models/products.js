var mongoose = require( 'mongoose' );

var ProductSchema = new mongoose.Schema({
    itemTitle: String,
    itemImage: String,
    itemDescription: String,
    itemLink: String,
    itemPrice: String
});

//mongoose.model('Product', ProductSchema).collection.dropIndexes();
mongoose.model('Product', ProductSchema);