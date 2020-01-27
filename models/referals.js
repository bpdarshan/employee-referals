const Joi = require('joi');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Status = new mongoose.Schema({
    isReferred : {
        type : Boolean,
        default : true
    },
    isAccepted : {
        type : Boolean,
        default : false
    },
    isInterviewed : {
        type : Boolean,
        default : false
    },
    isHired : {
        type : Boolean,
        default : false
    },
    notHired : {
        type : Boolean,
    }
}); 
 
const Referal = mongoose.model('Referal', new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
    job: {
        type: String,
        required: true,
    },
    referee_id: {
        type: Number,
    },
    referred_on:{
        type: Date
    },
   
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    job_id : {
        type: String,
        required: true
    },
    department : {
        type :String,
        required : true
    },
    status : {type : Status, required : true}
}));
 
function validateUser(user) {
    const schema = {
        job_id : Joi.string().required(),
        name: Joi.string().required(),
        qualification: Joi.string().required(),
        job: Joi.string().required(),
        // referee_id: Joi.number().integer().min(1000).max(99999999999999).required(),
        referred_on: Joi.date().required(),
        status : Joi.object({
            isAccepted : Joi.boolean().allow('', null).empty(['', null]).default('false').required(),
            isReferred : Joi.boolean().allow('', null).empty(['', null]).default('true').required(),
            isInterviewed : Joi.boolean().allow('', null).empty(['', null]).default('false').required(),
            isHired : Joi.boolean().allow('', null).empty(['', null]).default('false').required(),
            notHired : Joi.boolean().allow('', null).empty(['', null]).default('false').required()
        }).required(),
        email: Joi.string().required().email(),
        department: Joi.string().required(),
        phone: Joi.number().integer().required(),
    };
    return Joi.validate(user, schema);
}
 
exports.Referal = Referal;
exports.validate = validateUser;