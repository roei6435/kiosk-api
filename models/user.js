const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const userSchema = new Schema({

    _id: mongoose.Schema.Types.ObjectId,
    email:String,
    password:String, 
    createdAt:{type:Date , default:Date.now()},
    mobile:String,
    avater:{type:String, default:'https://pngset.com/images/business-avatar-set-of-icons-icons-for-free-face-snowman-tie-accessories-transparent-png-1710022.png'},          //Pic
    firstName:String,
    lastName:String,
    passcode:Number,
    isBusiness:{type:Boolean, default:false},
    isApproved:{type:Boolean, default:false},
    isLocked:{type:Boolean, default:false} 
});

module.exports = mongoose.model('User',userSchema); //(name schema, how is the schema?)


