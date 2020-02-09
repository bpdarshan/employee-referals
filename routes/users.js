const bcrypt = require("bcryptjs");
const _ = require('lodash');
const mongoose = require('mongoose');
const { User, validate } = require('../models/user');
const {Counter} = require('../models/counter');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const config = require('config');
const jwt = require('jsonwebtoken');


mongoose.set('useFindAndModify',false);
 
// router.use(function(req, res, next) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type,Authorization, Access-Control-Request-Method, Access-Control-Request-Headers");
//     next();
//   });

var cors = require('cors')
router.use(cors())
router.options('*', cors())
// router.get('/:name', function(req, res) {
//     var user = User.findOne({name:req.params.name}, (err, user) => {
//         if(!err){
//             if(user.usertype === "employee")
//             {
//                 return res.status(200).send(user);
//             }
//             else{
//                 res.send({
//                     message:"User doesnt exist"
//                 });
//             }
//         }
        

//     });

 // });
//Admin to View the Employee
router.get('/',verifyToken,async (req, res)=>{
    jwt.verify(req.token,'secretkey',(err,authdata)=>{
        if(err){
            res.send(403);
        }
        else{
            User.findOne({token:req.token},async (err,admin)=>{
                    if(admin.usertype==="admin"){
                        var user = User.find({usertype:"employee"}, (err, user) => {
                            if(err){
                                res.status(400).send(err);
                            }else{
                                if(user.length > 0){
                                    res.status(200).send(user);
                                }else{
                                    res.status(200).send({data: "no such document found",authdata});
                                }
                            }
                           
                        });
                    }
                    else{
                        res.status(403).send("not allowed to access");
                    }
                
            });
            
           
        }
    });
   
    
    // res.status(200).send(user);
});


 //Admin to add the employee 
router.post('/',verifyToken, async (req, res) => {
    jwt.verify(req.token,'secretkey',(err,authdata)=>{
        if(err){
            res.send(err);
        }
        else{
            User.findOne({token:req.token}, async(err,doc) =>{
                if(doc.usertype==="admin"){
                     //First Validate The Request
                    const { error } = validate(req.body);
                    if (error) {
                        res.status(400).send(error.details[0].message);
                    }
                   // Check if this user already exisits
                   let user = await User.findOne({ email: req.body.email });
                    if (user) {
                      res.status(400).send('That user already exisits!');
                    } 
                    else {
            
                        Counter.findByIdAndUpdate({ _id: "uid" },{ $inc	: { "seq": 1 } }, {new: true},async function(err, data){
                        if(err){
                            res.send(err);
                          
                        } else {
                            user = new User({
                                "name" : req.body.name,
                                "email" : req.body.email,
                            "password" : req.body.password,
                            "uid" : data.seq,
                            "usertype" : req.body.usertype,
                            "phone" : req.body.phone,
                            "department" : req.body.department,
                            "role" : req.body.role,
                            "salary" :req.body.salary
                            });
            
                            const salt = await bcrypt.genSalt(10);
                            user.password = await bcrypt.hash(user.password, salt);
                            await user.save();
                            res.status(200).json( " added succesfully");
                            // const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'));
                            // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
                            
            
                            
            
                        }
                        
                    });
                    
                            
                  
                
                    
                }
                }
                else{
                    res.send(err);
                }
            });
        }
    });
   
   
});

//admin to delete the user
router.post('/userdelete',verifyToken,function(req, res){
   jwt.verify(req.token,'secretkey',(err,authdata)=>{
        if(err){
            res.send(403);
        }
        else{
                User.findOne({token:req.token},async(err,doc)=>{
                    if(doc.usertype==="admin"){
                        var job=User.findOne({_id:req.body._id},function(err,job){
                           if(doc.department==job.department){
                               User.findOneAndRemove({_id : req.body._id}, function(err){
                                   if (!err) {
                                       res.send("user deleted");
                                   }
                                    else {
                                      res.send(err);
                                   }
                               });
                           }
                           else{
                               res.status(403).send("not allowed to delete");
                           }
                        });
                       }
                       else{
                        res.status(403).send("not allowed to delete");
                    }
                });
                   
                   
           }
        });
   
  });

function verifyToken(req,res,next){
    const bearerToken = req.header("Authorization");
    
    if(typeof bearerToken!=='undefined'){
        // const bearer = bearerHeader.split(' ');
        // const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else{
        res.sendStatus(403);
    }
}
 
module.exports = router;
