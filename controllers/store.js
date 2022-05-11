const express = require('express');
const mongoose = require('mongoose');
const router=express.Router();
const isAuth = require('./isAuth');

const User = require('../models/user');
const Store = require('../models/store');

router.post('/createStore', isAuth, async(request,response)=>{
   
    //accountId
    const associateId=request.account._id;             
    //Check if user have store
    const isStoreExist = await Store.findOne({associateId: associateId});  //search if have store with acccountId this
    if(isStoreExist){
        return response.status(200).json({
            message: 'You can only add one store per user'
        });
    }
    else
    {
        const storeId= mongoose.Types.ObjectId();
        const {                             //What server gets from the postman
            storeName,
            storeDescription,
            isTakeway,
            isDelivery,
            phone,
            city,address,latitude,longtitude
        } = request.body; 

        //Update user business
        const account = await User.findOne({associateId: associateId});
        account.isBusiness=true;
        return account.save()
        .then(account_updated=>{

            const _store=new Store({
            _id: storeId,
            associateId: associateId,
            storeName : storeName,
            isTakeway: isTakeway,
            isDelivery: isDelivery,
            storeDescription: storeDescription,
            subs:[],
            contactInfo:{
            email: request.account.email,
            mobile: request.account.mobile ,
            phone: phone,
            city: city,address:address,
            latitude: latitude,longtitude:longtitude
            },
            reviews:[],
            workingHours:[],     
            })
           return _store.save().then(newStore=>{
                return response.status(200).json({
                    StoreData:newStore,
                    accData:account_updated
                })
            })
        })
        .catch(error=>{
            return response.status(500).json({
                message: error
            })
        })
    }
})

router.put('/updateStore', isAuth, async(request,response)=>{

    const associateId = request.account._id;
    const store = await Store.findOne({associateId: associateId});
    const {
        storeName,
        isTakeway,
        isDelivery,
        storeDescription,
        email,
        mobile,
        phone,
        city,address,latitude,longtitude,
        workingHours,
        logo,
    }= request.body;
    
    User.findOne({email: email})
    .then(account=>{
        if(account &&request.account.email!=email){
            return response.status(200).json({
                message:'The email exist in system'
            })
        }else{
            User.findOne({mobile: mobile})   
            .then(account=>{
                if(account &&request.account.mobile!=mobile){
                    return response.status(200).json({
                        message:'This mobile is linked to another user'
                    })
                }else{
                    store.storeName=storeName;
                    store.isTakeway=isTakeway;
                    store.isDelivery=isDelivery;
                    store.storeDescription=storeDescription;
                    store.contactInfo = {
                        email:email,
                        mobile:mobile,
                        phone:phone,
                        city:city,address:address,
                        latitude:latitude,longtitude:longtitude,
                    },
                    store.contactInfo.longtitude=longtitude;
                    store.workingHours=workingHours;
                    store.logo=logo;
                    store.save().then(store_update=>{
                        return response.status(200).json({
                            message:'store updated',
                            store:store_update
                        })
                    })
                }
            })
        }
    })
    .catch(error=>{
        return response.status(500).json({
            message: error
        })
    })
          
}

)
module.exports = router;