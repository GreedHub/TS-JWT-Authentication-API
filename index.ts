const express = require('express');
const cors = require("cors");
const app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
import { AppConfig } from './require/config/AppConfig';
import { LoginManager } from './require/classes/LoginManager';

app.use(bodyParser.json({limit: '100mb',parameterLimit: 100000, extended: true})); // support json encoded bodies
app.use(bodyParser.urlencoded({limit: '100mb',parameterLimit: 100000, extended: true})); // support encoded bodies
app.use(cookieParser());
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

    let {username,password,device} = req.body;

    let loginManager = new LoginManager();

    let loginResponse = await loginManager.authenticateUser(username,password,device)
        .catch(err=>{
            res.status(401).send(err);
        })

    res.status(200).send(loginResponse);
    
});

app.post('/token', async(req, res)=> {

    let {refreshToken} = req.body;

    let loginManager = new LoginManager();

    let loginResponse = await loginManager.refreshToken(refreshToken)
        .catch(err=>{
            res.status(401).send(err);
        })

    res.status(200).send(loginResponse);
    
});

app.delete('/token', async(req, res)=> {

    let {refreshToken} = req.body;

    let loginManager = new LoginManager();

    let loginResponse = await loginManager.invalidateRefreshToken(refreshToken)
        .catch(err=>{
            res.status(401).send(err);
        })

    res.status(200).send(loginResponse);
    
});

app.get('/private', async(req,res)=>{

    let {token} = req.cookies;

    let loginManager = new LoginManager();

    let loginResponse = await loginManager.privatePath(token)
        .catch(err=>{
            console.log(err);
        })

    res.status(200).send(loginResponse);


});

app.get('/publicKey', async(req,res)=>{

    res.status(200).send({publicKey:AppConfig.jwt.accessToken.publicToken});

});

app.listen(AppConfig.api.exposedPort,()=>{
    console.log(`Server started in http://localhost:${AppConfig.api.exposedPort}/`)
})