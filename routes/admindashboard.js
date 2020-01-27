const _ = require('lodash');
const mongoose = require('mongoose');
const {Referal} = require('../models/referals');
const {User} = require('../models/user');
const {Job} = require('../models/job');
const express = require('express');
const router = express.Router();


// router.use(function(req, res, next) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Authorization ,Access-Control-Request-Method, Access-Control-Request-Headers");
//     next();
//   });

var cors = require('cors')
router.use(cors())
router.options('*', cors())

//Number of employees in company
router.get('/employeecount',(req,res)=>{
        
            User.count({usertype: { $regex: new RegExp("^" + 'Employee'.toLowerCase(), "i") }}, function( err, data){
                if(!err){
                    res.status(200).send({data : data})
                }
                else{
                    res.send({data: err});
                }
                
            });
       
});
// Number of employees referred
router.get('/refereecount',(req,res)=>{
    User.count({usertype: { $regex: new RegExp("^" + 'Employee'.toLowerCase(), "i") }, referred : {$gt : 0}}, (err, data) => {
        res.status(200).send({data : data});
    });
});
//TOp referee in the companies
router.get('/topreferee',(req,res)=>{
    User.find({usertype: { $regex: new RegExp("^" + 'Employee'.toLowerCase(), "i") } }, {name : 1, referred : 1},).sort({ referred : -1 }).exec(function(err, user){
     var arr=[]
     for(var i=0;i<user.length;i++){
         if(user[i].referred>1){
             arr.push(user[i])
         }
     }
        res.send(arr);
    });
});

router.get('/topdepartment',(req,res)=>{
    User.aggregate([
        {
             $group: 
                { _id: {usertype:"$usertype", department:"$department"}, total_employees: { $sum: 1 } } },
                {$project : {department : '$_id.department',usertype:'$_id.usertype', total : '$total_employees', _id:0}},
                {$redact :{
                    $cond : {
                        if:{
                            $eq:["$usertype", "employee"]

                        },
                        then:"$$KEEP",
                        else:"$$PRUNE"
                    }
                }}

        ],(err, data) => {
            res.send(data);
        }
       );
       
});



module.exports = router;