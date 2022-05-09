const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const storeSchema = new Schema({

    _id: mongoose.Schema.Types.ObjectId,
    associateId:{type: mongoose.Schema.Types.ObjectId ,ref:'User'},
    storeName:String,
    isTakeway:Boolean,
    isDelivery:Boolean,
    storeDescription: String,
    subs:[
        {
            associateId:{type: mongoose.Schema.Types.ObjectId ,ref:'User'},
        }
    ] ,
    contactInfo:{
        email: String,
        mobile: String,
        phone: String,
        city: String,
        address: String,
        latitude: String,                    //cordinates location 
        longtitude: String
    },
    reviews: [
        { 
            accountId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
            reviewContext:String,
            createdAt:{type:Date, default: Date.now()},
            rank:Number,
            isPublished:Boolean
        }
    ],
    workingHours:[
        { 
            day: Number , fromHour:Number, toHour:Number,isOpen:Boolean
        }
    ],
    logo:{type:String,default:''},
    createdAt:{type:Date, default: Date.now()},
    updatedAt:{type:Date, default: Date.now()}, 
    isLocked:{type:Boolean,default:false},
    
})

module.exports = mongoose.model('Store', storeSchema);