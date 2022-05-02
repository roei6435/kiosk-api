const jwt= require('jsonwebtoken');
const User=require('../models/user');

module.exports =(request,response,next) => {       //create anonymous function and export

    const bearerHeader = request.headers['authorization'];
    if (bearerHeader){

       const bearer= bearerHeader.split(' ');
       const bearerToken = bearer[1];
      
       jwt.verify(bearerToken,'Ufw6RnVFFwcSWlReZcSi1bIQIr9qlFII',(err,authData) => {
            if (err){
                return response.sendStatus(403);
            }else{
                User.findById(authData._id)
                .then(account => {
                    request.token=bearerToken;  //OverLoad on request token and account
                    request.account=account;
                    next();
                })
                .catch(err => {
                    return response.sendStatus(403)
                })
            }

       })

    }else{
        return response.sendStatus(403);      //403: Cant identify you
    }
    

}