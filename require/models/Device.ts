import {Schema,model} from 'mongoose';

const deviceSchema = new Schema({
    refreshToken: { type: String, required: true },
    name: { type: String, required: true },
    ip: { type: String, required: true, default: "regular" },
    os: { type: String },
    loginDate: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
}); 

let DeviceModel = model('Device',deviceSchema);

export { DeviceModel };