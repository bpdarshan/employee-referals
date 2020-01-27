const Joi = require('joi');
const mongoose = require('mongoose');
 
const User = mongoose.model('addjob', new mongoose.Schema({
    qualification: {
        type: String,
        required: true,
       
    },
    experience: {
        type: String,
        required: true,
    },
    salary: {
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
    referalbonus: {
        type: Number,
        required: true,
    }
    
}));
 
function validateUser(user) {
    const schema = {
        qualification: Joi.string().required(),
        salary: Joi.number().integer().required(),
        experience: Joi.string().required(),
        department: Joi.string().required(),
        role: Joi.string().required(),
        referalbonus : Joi.number().integer().required()
    };
    return Joi.validate(user, schema);
}
 
module.exports.Job = User;
module.exports.validate = validateUser;