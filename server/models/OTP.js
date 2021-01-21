const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    email: {
        type:String
    },

    otp: {
        type: Number
    },
    expire_at: {
        type: Date, 
        default: Date.now, 
        expires: -100
    } 
}, {
    timestamps: true
});

const Otp = mongoose.model('Otp', userSchema);

module.exports = { Otp }