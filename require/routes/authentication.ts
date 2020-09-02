import { Router } from 'express';
import { LoginManager } from '../classes/LoginManager';

let authenticationRouter = Router();

authenticationRouter
    .route("/register")
    .post(async (req,res)=>{
        
        let {username,password,mail} = req.body;
    
        let loginManager = new LoginManager();
    
        let loginResponse = await loginManager.registerUser(username,password,mail)
            .catch(err=>{
                res.status(400).send(err);
            })
    
        res.status(200).send(loginResponse);

    })
    
    authenticationRouter
    .route("/login")
    .post(async(req, res)=> {        
            
        let {username,password,device} = req.body;
    
        let loginManager = new LoginManager();
    
        let loginResponse = await loginManager.authenticateUser(username,password,device)
            .catch(err=>{
                res.status(401).send(err);
            })
    
        res.status(200).send(loginResponse);
        
    });

export { authenticationRouter }