// const Joi = require('joi');
const mongoose = require('mongoose');

const Counter = mongoose.model('counter', new mongoose.Schema({
    _id : String,
    seq : Number,
}));

module.exports.Counter = Counter;