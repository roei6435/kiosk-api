const express = require('express');
const bodyParser = require('body-parser');  //Management communication and convart to JSON and convarting Qury string to route
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded());  //use functionality from lybary in our app
app.use(bodyParser.json());


const url= 'mongodb+srv://Roei6435:6435@cluster0.j0bpj.mongodb.net/kiosk_DB?retryWrites=true&w=majority';
//connect string

const port = 5090;

mongoose.connect(url).     //connect to database 
then(result => {
    console.log(result);
    app.listen(port, function(){       //if connect is successful app is listening   
        console.log('listening on port'+port);
    })
})
.catch(err =>{
    console.log(err);
})

