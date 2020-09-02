const crypto = require('crypto');
const jwt = require('jsonwebtoken');

import { MongooseManager } from './MongooseManager';
import { AppConfig } from '../config/AppConfig';
import { SqlManager, SqlParameter } from './SqlManager';
import { TokenGenerator } from '../helpers/TokenGenerator';
import { UserModel } from '../models/User';
import { DeviceModel } from '../models/Device';

let mongooseManager = new MongooseManager(AppConfig.db.user,AppConfig.db.pass,AppConfig.db.host,AppConfig.db.port,AppConfig.db.name);


//You need to generate 2 PEM keys in the folder ./keys

const {accessToken, refreshToken} = AppConfig.jwt;

const tokenGenerator = new TokenGenerator({key:accessToken.privateToken, passphrase: accessToken.passphrase}, accessToken.publicToken, accessToken.options);
const refreshTokenGenerator = new TokenGenerator({key:refreshToken.privateToken, passphrase: refreshToken.passphrase}, refreshToken.publicToken, refreshToken.options);
class LoginManager{

    registerUser(username:string,password:string,mail:string){

        return new Promise(async (resolve,reject)=>{

            let mongoose = await mongooseManager.connect();

            const salt = this.generateSalt();  

            const encryptedPassword = this.encryptPassword(password,salt);
                        
            //TODO, CONSEGUIME DE LA BASE
            const id_status = 1;
            const id_role = 2;

            const user = new UserModel({
                username,
                password: encryptedPassword,
                mail,
                salt,
                status:"regular",
            });

            user.save((err,document)=>{
                if(err) { 
                    let msg = "Registration failed: ";
                    msg += err.code == 11000 ? "User already exists" : err.code;
                    reject(msg);
                    return;
                }

                resolve("Registration successful");
            });

        });

    }

    authenticateUser(username:string,password:string,device:{}){

        return new Promise(async (resolve,reject)=>{

            let mongoose = await mongooseManager.connect();

            let userQuery = await UserModel.find({
                username
            });

            let userInfo:any = userQuery[0];

            if(!userInfo){
                reject("login failed");
                return;
            }

            const encryptedPassword = this.encryptPassword(password,userInfo.salt);

            if(userInfo.password != encryptedPassword){
                reject("login failed");
                return;
            }

            let token = tokenGenerator.sign({ myclaim: 'something' }, { audience: 'myaud', issuer: 'myissuer', jwtid: '1', subject: 'v' })
            let refreshToken = refreshTokenGenerator.sign({ user: userInfo.username , mail:userInfo.mail}, { audience: 'myaud', issuer: 'myissuer', jwtid: '1', subject: 'v' })
           
            let userDevice = new DeviceModel({
                ...device,
                refreshToken,
                active:true,
            });

            userInfo.devices.push(userDevice);

            userInfo.save();

            resolve({token,refreshToken});

        });

    }    

    refreshToken(refreshToken:string){
        return new Promise(async(resolve,reject)=>{    
            
            let isValid = refreshTokenGenerator.isValidToken(refreshToken);

            if(!isValid){
                reject("Invalid token");
                return;
            }

            let mongoose = await mongooseManager.connect();

            let userQuery = await UserModel.find({
                "devices": { 
                    "$elemMatch": { 
                        "refreshToken": refreshToken, 
                        "active": true  
                    } 
                }
            });
        
            let userInfo:any = userQuery[0];

            if(!userInfo){
                reject("Invalid token");
                return;
            }

            let token = tokenGenerator.sign({ myclaim: 'something' }, { audience: 'myaud', issuer: 'myissuer', jwtid: '1', subject: 'v' })

            resolve({token});
            
        });
    }

    invalidateRefreshToken(refreshToken:string){
        return new Promise(async(resolve,reject)=>{    
            
            let isValid = refreshTokenGenerator.isValidToken(refreshToken);

            if(!isValid){
                reject("Invalid token");
                return;
            }

            let mongoose = await mongooseManager.connect();

            let userQuery = await UserModel.find({
                "devices": { 
                    "$elemMatch": { 
                        "refreshToken": refreshToken, 
                        "active": true  
                    } 
                }
            });

            let userInfo:any = userQuery[0];

            if(!userInfo){
                reject("Invalid token");
                return;
            }

            userInfo.devices = userInfo.devices.map(_device=>{
                if(_device.refreshToken == refreshToken)
                    _device.active = false

                return _device;
            })
                        
            userInfo.markModified('devices');

            userInfo.save();

            resolve("token invalidated")
            
        });
    }

    privatePath(token:string){
        return new Promise((resolve,reject)=>{    
            
            if(!tokenGenerator.isValidToken(token)){
                reject("Unauthorized");
                return;
            }

            resolve("Private path content");
            
        });
    }

    encryptPassword(password,salt){

        const saltedPassword = password+salt;

        return crypto.createHash('sha256').update(saltedPassword).digest('base64');
    }

    generateSalt(){
        return crypto.randomBytes(32).toString('base64');
    }

}

export {LoginManager};