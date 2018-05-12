var mongoose = require( 'mongoose' );

var likeSchema = new mongoose.Schema({
        itemId: {
        type: String
        // required: true,
      //  unique: false
    },
    itemTitle: {type: String},
    itemImage: {type: String},
    itemDescription: {type: String},
    itemLink: {type: String},
    itemPrice: {type: String},
    userId: {
        type: String
        // required: true,
     //   unique: false
    }
});

//mongoose.model('Like', likeSchema).collection.dropIndexes();
mongoose.model('Like', likeSchema).collection.createIndex({ itemId: 1, userId: 1}, { unique: true });
mongoose.model('Like', likeSchema);