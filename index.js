const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const users = require('./routes/users');
const auth = require('./routes/auth');
const ref=require('./routes/referee');
const express = require('express');
const addjob = require('./routes/addjob');
const admindash = require('./routes/admindashboard');
const app = express();
var cors = require('cors')


mongoose.connect('mongodb+srv://darshan:darshan@cluster0-xhljx.mongodb.net/employee_referals?retryWrites=true&w=majority')
    .then(() => console.log('Now connected to MongoDB!'))
    .catch(err => console.error('Something went wrong', err));

    
    
app.use(cors())
app.options('*', cors())
app.use(express.json());
app.use('/api/users/', users);
app.use('/auth', auth);
app.use('/api/job',addjob);
app.use('/api/referee',ref);
app.use('/admindashboard',admindash);
 
const port = process.env.PORT || 4002;
app.listen(port, () => console.log(`Listening on port ${port}...`));
