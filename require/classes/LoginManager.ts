const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const AppConfig = require('../config/AppConfig');
import { SqlManager, SqlParameter } from './SqlManager';
import { TokenGenerator } from '../helpers/TokenGenerator';

let sql = new SqlManager(AppConfig.db.schema);
sql.setDbUser(AppConfig.db.user,AppConfig.db.password);
sql.setServer(AppConfig.db.host);

const tokenGenerator = new TokenGenerator(AppConfig.jwt.accessToken.privateToken, AppConfig.jwt.accessToken.publicToken, AppConfig.jwt.accessToken.options);
const refreshTokenGenerator = new TokenGenerator(AppConfig.jwt.refreshToken.privateToken, AppConfig.jwt.refreshToken.publicToken, AppConfig.jwt.refreshToken.options);
class LoginManager{

    registerUser(user,password,mail){

        return new Promise(async (resolve,reject)=>{

            const salt = this.generateSalt();  

            const encryptedPassword = this.encryptPassword(password,salt);
                        
            //TODO, CONSEGUIME DE LA BASE
            const id_status = 1;
            const id_role = 2;

            let params = [
                new SqlParameter("user",user),
                new SqlParameter("password",encryptedPassword),
                new SqlParameter("mail",mail),
                new SqlParameter("salt",salt),
                new SqlParameter("id_status",id_status),
                new SqlParameter("id_role",id_role),

            ];

            let response = await sql.executeProcedure("registerUser",params)
                .catch(err=>{
                    console.log(err);
                    reject(err);
                    return;
                });
            
            resolve(response);

        });

    }

    authenticateUser(username,password){

        return new Promise(async (resolve,reject)=>{

            let userInfo:any = await sql.executeProcedure("getUserByUsername",[new SqlParameter("username",username)])
                .catch(err=>{
                    console.log("err");
                    reject(err);
                    return;
                });

            if(!userInfo){
                console.log("User not found");
                reject("User not found");
            }

            userInfo = userInfo[0];

            const encryptedPassword = this.encryptPassword(password,userInfo.salt);

            if(userInfo.password != encryptedPassword){
                console.log("login failed");
                reject("login failed");
            }

            let token = tokenGenerator.sign({ myclaim: 'something' }, { audience: 'myaud', issuer: 'myissuer', jwtid: '1', subject: 'v' })
            let refreshToken = refreshTokenGenerator.sign({ user: userInfo.username , mail:userInfo.mail}, { audience: 'myaud', issuer: 'myissuer', jwtid: '1', subject: 'v' })
            resolve({token,refreshToken});

        });

    }    

    refreshToken(refreshToken:string){
        return new Promise((resolve,reject)=>{    
            
            let isValid = refreshTokenGenerator.isValidToken(refreshToken);

            if(!isValid){
                reject("Invalid token");
                return;
            }

            let token = tokenGenerator.sign({ myclaim: 'something' }, { audience: 'myaud', issuer: 'myissuer', jwtid: '1', subject: 'v' })

            resolve({token});
            
        });
    }

    privatePath(token:string){
        return new Promise((resolve,reject)=>{    
            
            let isValid= tokenGenerator.isValidToken(token);

            resolve(isValid) ;
            
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