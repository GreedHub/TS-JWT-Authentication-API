'use strict';

let mongoose = require('mongoose');

class MongooseManager {

    db:any;
    user:string;
    host:string;
    port:string;
    password:string;
    dbName:string;

    constructor(user:string,password:string,host:string,port:string,dbName:string){

        this.user = user;
        this.password = password;
        this.host = host;
        this.port = port;
        this.dbName = dbName;

    }

    async connect(){
        await mongoose.connect(`mongodb://${this.user}:${this.password}@${this.host}:${this.port}/${this.dbName}?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });

        return mongoose.connection;
    }

}

export {MongooseManager};