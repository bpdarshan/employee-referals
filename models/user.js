const Joi = require('joi');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const User = mongoose.model('user', new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    uid: {
        type: Number,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    usertype: {
        type: String,
        required: true,
    },
    phone: {
            type: Number,
            required: true,
        },
    department: {
            type: String,
            required: true,
        },
     role: {
            type: String,
            required: true,
        },
     salary:{
            type:Number,
            required:true,
        },
        referred : {
            type : Number
        },
        points : {
            type : Number
        },
        token:{
            type:String
        }
    
   
    
}));

function validateUser(user) {
    const schema = {
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        // uid: Joi.number().integer().min(1).max(9999999999),
        phone: Joi.number().integer().required(),
        department: Joi.string().required(),
        usertype: Joi.string().required(),
        role: Joi.string().required(),
        salary: Joi.number().integer().required(),
    };
    return Joi.validate(user, schema);
}
 
exports.User = User;
exports.validate = validateUser;