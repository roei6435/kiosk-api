const express = require('express');
const mongoose = require('mongoose');
const router=express.Router();
const bcryptjs= require('bcryptjs');

//Models
const User =require('../models/user'); 


router.get('/sayHello', async(request,response) => {       //fun1-checked if all is good

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

    
})

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
            const formetted_password = await bcryptjs.hash(password,5);  //(how is the password?,level hesh)
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
})

// Generate a random number for passcode
function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



module.exports = router;