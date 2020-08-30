let sqlConection = require("mssql");

class SqlManager{

    instance:any;
    database:string;
    server:string;
    user:string;
    password:string;

    constructor(db_name) {

        this.database = db_name;
        this.server="localhost";
        this.user="root";
        this.password="";

        return this;
        
    }

    setDbUser(user,password){
        this.user = user;
        this.password = password;
    }

    setServer(server){
        this.server = server;
    }

    async executeProcedure(sp_name,array_of_sqlparameter=[]){

        let pool = await new sqlConection.ConnectionPool({
            'server'   : this.server,
            'database' : this.database,
            'user'     : this.user,
            'password' : this.password
        }).connect();   
        let req = pool.request();
        
        return new Promise (async (resolve,reject)=>{
    
        array_of_sqlparameter.forEach(parameter=>{
            req.input(parameter.name, sqlConection.Char, parameter.value);
        });
        
        req.execute(sp_name,(err, result)=>{
            if(err!=undefined){
                console.log(err);
                reject(err);
                return;
            }          
            if(result.recordset){ 
                let response = []; 
                for(let k in result.recordset){ 
                    response.push(result.recordset[k])
                }
                resolve(response);
            }  
          
            resolve([]);
        });
    
    });
    
    }

    async executeQuery(query,params:SqlParameter[]=[]):Promise<any[]>{

        let pool = await new sqlConection.ConnectionPool({
            'server'   : this.server,
            'database' : this.database,
            'user'     : this.user,
            'password' : this.password
        }).connect();   
        let req = pool.request();
        
        return new Promise(async (resolve,reject)=>{
    
            params.forEach(parameter=>{
                req.input(parameter.name, sqlConection.Char, parameter.value);
            });
        
            req.query(query,(err, result)=>{
                if(err!=undefined){
                    console.log(err);
                    reject(err);
                    return;
                }          
                if(result.recordset){ 
                    let response = []; 
                    for(let k in result.recordset){ 
                        response.push(result.recordset[k])
                    }
                    resolve(response);
                }  
            
                resolve([]);
            });
        
        });
    
    }

}
class SqlParameter{

    name:string;
    value:string;

    constructor(name,value){
        this.name = name;
        this.value = value;
    }
    
}

export {SqlManager,SqlParameter}; 