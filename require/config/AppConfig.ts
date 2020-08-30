require('dotenv').config({ path: './EnvVars.env' })

const AppConfig = {

    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        schema: process.env.DB_SCHEMA 

    },
    jwt:{
        accessToken: {
            publicToken: process.env.JWT_PUBLIC,
            privateToken: process.env.JWT_PRIVATE,
            options: {algorithm: 'HS512', keyid: '1', noTimestamp: false, expiresIn: '15m', notBefore: '2s' },
        },
        refreshToken: {
            publicToken: process.env.JWT_REFRESH_PUBLIC,
            privateToken: process.env.JWT_REFRESH_PRIVATE,
            options: {algorithm: 'HS512', keyid: '1', noTimestamp: false, expiresIn: '30d', notBefore: '2s' },
        },
        
    }

}

module.exports = AppConfig;