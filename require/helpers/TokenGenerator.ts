const jwt = require('jsonwebtoken');

class TokenGenerator  {

  secretOrPrivateKey:String;
  secretOrPublicKey:String;
  options:Object;

  constructor(secretOrPrivateKey, secretOrPublicKey, options){
    this.secretOrPrivateKey = secretOrPrivateKey;
    this.secretOrPublicKey = secretOrPublicKey;
    this.options = options; //algorithm + keyid + noTimestamp + expiresIn + notBefore
  }

  sign(payload, signOptions) {
    const jwtSignOptions = Object.assign({}, signOptions, this.options);
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
  }
  
  isValidToken(token:string){

    /* TODO: check how to validate with public key */
    return jwt.verify(token,this.secretOrPrivateKey,(err, decoded)=>{
    
        if(err){
            console.log(err);
            return false;
        }

        return true;
            
    });
    
}

}


export  { TokenGenerator };