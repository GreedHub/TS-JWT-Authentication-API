import {Schema,model} from 'mongoose';


const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    mail: { type: String, required: true },
    name: { type: String },
    lastname: { type: String },
    status: { type: String, required: true, default: "regular" },
    lastLogin: { type: Date, default: Date.now },
    devices: { type: Array }
}); 

let UserModel = model('User',userSchema);

export { UserModel };