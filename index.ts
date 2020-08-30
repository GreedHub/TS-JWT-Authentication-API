const express = require('express');
const cors = require("cors");
const app = express();
var bodyParser = require('body-parser');
import { AppConfig } from './require/config/AppConfig';
import { LoginManager } from './require/classes/LoginManager';

app.use(bodyParser.json({limit: '100mb',parameterLimit: 100000, extended: true})); // support json encoded bodies
app.use(bodyParser.urlencoded({limit: '100mb',parameterLimit: 100000, extended: true})); // support encoded bodies
app.use(cors());

app.post('/register', async(req, res)=> {

    let {username,password,mail} = req.body;

    let loginManager = new LoginManager();

    let loginResponse = await loginManager.registerUser(username,password,mail)
        .catch(err=>{
            console.log(err);
        })

    res.status(200).send(loginResponse);

});

app.post('/login', async(req, res)=> {

    let {username,password} = req.body;

    let loginManager = new LoginManager();

    let loginResponse = await loginManager.authenticateUser(username,password)
        .catch(err=>{
            console.log(err);
        })

    res.status(200).send(loginResponse);
    
});

app.post('/token', async(req, res)=> {

    let {refreshToken} = req.body;

    let loginManager = new LoginManager();

    let loginResponse = await loginManager.refreshToken(refreshToken)
        .catch(err=>{
            console.log(err);
        })

    res.status(200).send(loginResponse);
    
});

app.get('/private', async(req,res)=>{

    let {token} = req.query;

    let loginManager = new LoginManager();

    let loginResponse = await loginManager.privatePath(token)
        .catch(err=>{
            console.log(err);
        })

    res.status(200).send(loginResponse);


});

app.get('/publicKey', async(req,res)=>{

    let {token} = req.query;

    let loginManager = new LoginManager();

    let loginResponse = await loginManager.privatePath(token)
        .catch(err=>{
            console.log(err);
        })

    res.status(200).send(loginResponse);


});

app.listen(AppConfig.api.exposedPort,()=>{
    console.log(`Server started in http://localhost:${AppConfig.api.exposedPort}/`)
})