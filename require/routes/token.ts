import { Router } from 'express';
import { LoginManager } from '../classes/LoginManager';
import { AppConfig } from '../config/AppConfig';

let tokenRouter = Router();

tokenRouter
    .route("/token")
    .post(async (req,res)=>{
        
        let {refreshToken} = req.body;
    
        let loginManager = new LoginManager();
    
        let loginResponse = await loginManager.refreshToken(refreshToken)
            .catch(err=>{
                res.status(401).send(err);
            })
    
        res.status(200).send(loginResponse);

    })
    .delete(async(req, res)=> {
    
        let {refreshToken} = req.body;
    
        let loginManager = new LoginManager();
    
        let loginResponse = await loginManager.invalidateRefreshToken(refreshToken)
            .catch(err=>{
                res.status(401).send(err);
            })
    
        res.status(200).send(loginResponse);
        
    });

tokenRouter
    .route("/publicKey")
    .get(async(req,res)=>{

        res.status(200).send({publicKey:AppConfig.jwt.accessToken.publicToken});
    
    });

export { tokenRouter }