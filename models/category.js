const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({

    _id: mongoose.Schema.Types.ObjectId,
    storeId:{type:mongoose.Schema.Types.ObjectId ,ref:'Store'},
    categoryName:String,
    categoryImage:{type:String,default:''},
    priority: Number,
});

module.exports = mongoose.model('Category', categorySchema);