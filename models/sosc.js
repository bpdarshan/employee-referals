const Joi = require('joi');
const mongoose = require('mongoose');
const sosc = mongoose.model('sosc', new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
   
    
}));

 
exports.sosc = sosc;
