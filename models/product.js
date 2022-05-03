const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({

    _id: mongoose.Schema.Types.ObjectId,
    storeId:{type:mongoose.Schema.Types.ObjectId ,ref:'Store'},
    categoryId:{type:mongoose.Schema.Types.ObjectId ,ref:'Category'},
    productName:String,
    productImages:[
        {
            imageSource:String,
        }
    ],
    price:Number,
    discount:{type:Number,default:0},
    unitInStock:Number,
    desclimer:String,                //COMMENT 
    isAgeLimitation:Boolean,
});

module.exports = mongoose.model('Product', productSchema);