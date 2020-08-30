require('dotenv').config({ path: './EnvVars.env' });
const fs = require('fs');

const AppConfig = {

    api:{
        exposedPort: process.env.EXPOSED_PORT,
    },
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        schema: process.env.DB_SCHEMA 

    },
    jwt:{
        accessToken: {
            publicToken: fs.readFileSync('./keys/accessPublic.pem', 'utf8'),
            privateToken: fs.readFileSync('./keys/accessPrivate.pem', 'utf8'),
            passphrase: process.env.JWT_PASSPHRASE,
            options: {
                algorithm: 'RS512', 
                keyid: '1', 
                noTimestamp: false, 
                expiresIn: '15m', 
                notBefore: '2s' 
            },
        },
        refreshToken: {
            publicToken: fs.readFileSync('./keys/refreshPublic.pem', 'utf8'),
            privateToken: fs.readFileSync('./keys/refreshPrivate.pem', 'utf8'),
            passphrase: process.env.JWT_REFRESH_PASSPHRASE,
            options: {
                algorithm: 'RS512', 
                keyid: '1', 
                noTimestamp: false, 
                expiresIn: '30d', 
                notBefore: '2s' 
            },
        },
        
    }

}

export {AppConfig};