const express = require('express');
const mongoose = require('mongoose');
const router=express.Router();
const bcryptjs= require('bcryptjs');
const jwt= require('jsonwebtoken');
const isAuth = require('./isAuth');

//Models
const User =require('../models/user'); 
const Store = require('../models/store');
const Category = require('../models/category');

//getting list of accounts
router.get('/AllAccounts', async(request,response) => {      

    try {
        const users = await User.find();
        return response.status(200).json({
            allusers: users
        });
    } catch (error) {
        return response.status(500).json({
            message: error
        });
    }

    
});

router.post('/createAccount', async(request,response) => {

    //Get user inputs
    const {firstName, lastName,email,password,mobile} = request.body;
    //Check if user exists
    User.findOne({email: email})    //Comparison email(from Model user)==email(from req.body)
    .then(async account=>{
        
        if(account){                 
            return response.status(200).json({
                message: 'User is exist in system'
            });
        }
        else{           
            //Crypt password
            const formetted_password = await bcryptjs.hash(password,10);  //(how is the password?,level hesh)

            //Generate passcode
            const passcode=generateRandomIntegerInRange(1000,9999);

            //Create user in MongoDB
            const _user=new User({
                _id: mongoose.Types.ObjectId() ,
                email:email,
                password:formetted_password,      //like a schama
                mobile:mobile,
                firstName:firstName,
                lastName:lastName,
                passcode:passcode
            })
            //Save user and response.
            _user.save().
            then(account_created=>{
                return response.status(200).json({
                    message:account_created
                });
            })
        }
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        });
    })
});

// Generate a random number for passcode
function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Verify passcode
router.post('/verify', async(request,response)=>{
    //Get passcode(from input user) and email(from state in application)
    const { email,passcode} =request.body;
    User.findOne({ email: email}).       //Check if is user exist
    then(async account => {  
        if(account){     
            if(account.passcode==passcode){      //Verify passcode              
                account.isApproved=true;               //Update isApproved in dataBase
                account.save().
                then(account_updated =>{
                    return response.status(200).json({          //Response      
                        message:account_updated
                    });
                })              
            }
            else{
                return response.status(200).json({
                    message:'The passcode is not match.'
                });
            }
        }else{
            return response.status(200).json({
                message:'User not found.'
            });
        }
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        });
    })  
});

//Login
router.post('/login', async(request,response)=>{

    //Get email and password
    const {email,password} = request.body;
    //Is user exist
    User.findOne({email: email})
    .then( async account=>{
        
        if(account){
            //Is approved and is locked
            if(account.isApproved&&!account.isLocked){
                //Compare passwords
                const isMatch=await bcryptjs.compare(password,account.password);
                if(isMatch&&account.email==email){
                    //Create TOKEN
                    const acc_data={
                        firstName: account.firstName,  //A piece of data
                        lastName: account.lastName,
                        avatar: account.avatar,
                        mobile: account.mobile,
                        email: account.email,
                        _id: account._id,
                    };
                    //Create TOKEN (how is data?,key)
                    const token= await jwt.sign(acc_data,'Ufw6RnVFFwcSWlReZcSi1bIQIr9qlFII'); 
                    return response.status(200).json({    //Response
                        token: token
                    });
                }else{
                    return response.status(200).json({
                        message: "Password or email is incorrect."
                    });    
                }
            }else{
                return response.status(200).json({
                    message: "This account not active."
                });    
            }
        }else{
            return response.status(200).json({
                message: "User not found."
            });    
        }
    })
    .catch(error=>{
        return response.status(500).json({
            message: error
        });
    })
});

//forgetPassword
router.post('/forgetPassword',async(request,response)=>{

    const email = request.body.email;
    User.findOne({email: email})
    .then(async account=>{

        if(account){
            const passcode= generateRandomIntegerInRange(1000,9999);
            account.passcode = passcode;
            account.save()
            .then( account_updated=>{
                return response.status(200).json({
                    message: account_updated.passcode
                });
            });
        }else{
            return response.status(200).json({
                message: "The user not found."
            })
        }
    })
    .catch(err=>{
        return response.status(500).json({
            message:err
        });
    });
});

//updatePassword
router.post('/updatePassword', async(request,response)=>{
    //Get datlis newpass and email
    const {email,newpassword} = request.body;
    //Check if user exist
    User.findOne({email: email})
    .then(async account=>{

        if(account){
            const formetted_password= await bcryptjs.hash(newpassword,10); 
            account.password = formetted_password;         //Save formetted password in db
            account.save()
            .then(async account_updated=>{
                return response.status(200).json({   
                    message:account_updated       //Response
                })
            })
        }else{
            return response.status(200).json({
                message: 'User not found.'
            })
        }
    })
    .catch(err=>{
        return response.status(500).json({
            message: err
        })
    })
});



router.get('/getUserData', isAuth, async(request,response)=>{
    const accId= request.account._id;
    //פרטי המשתמש וגם פרטי החנות ששייכת אליו
    const store = await Store.findOne({associateId:accId}).populate('associateId');
    //const categories = await Category.findOne({storeId:store._id});
    //const products= await Product.findOne({storeId:store._id});
    return response.status(200).json({
        data:store
    })

    
    
})






module.exports = router; 