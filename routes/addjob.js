const bcrypt = require("bcryptjs");
const _ = require('lodash');
const {Job} = require('../models/job');
const express = require('express');
const {User} =require('../models/user')
const router = express.Router();
const jwt = require('jsonwebtoken');
 

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

// router.post('/browsejob',(req,res)=>{
//     var filter = {};
//         if(req.body.searchby == "department"){
//             filter = {
            
//                 department : req.body.department
//             }

//         }
//         Job.find(filter, (err, job) => {
//             if(err){
//                  res.status(400).send(err);
//             }else if(job[0]){
//                 res.status(200).send({data:job});
//             }else{
//                 res.status(200).send({data:"No data"});
//             }
       
//          });
  
// });


router.get('/',verifyToken, async (req,res) => {
    
    jwt.verify(req.token,'secretkey',(err,authdata)=>{
        if(err){
            res.send(403);
        }
        else{
            Job.find({}, (err,job) => {
                if(err){
                    res.status(400).send(err);
                }
                else if(Job.length>0){
                    res.send(job);
                }
                else{
                    res.status(200).send({data: "no such document found",authdata});
                }
            });
           
        }
    });
        
// router.post('/search', async (req,res) => {
//     if(req.body.search == ""){
//     // if(req.query.searchby == null){
//         Job.find({}, (err,job) => {
//             if(!err){
//                     res.status(200).send({data:job});
//             }
//         });
//     }else{     
//         console.log(req.body.search);
//         Job.find({$or: [{role:req.body.search.toLowerCase()},{department:req.body.search.toLowerCase()}]}, (err, job) => {
//             console.log(job);        
//             if(!err){
//                             res.status(200).send({data:job});
//                         }
//                         else{
//                             res.status(400).send({"message":"No Such Jobs found"});
//                         }
//         });
//     }
// });

});
router.post('/jobdelete',verifyToken,function(req, res){
    jwt.verify(req.token,'secretkey',(err,authdata)=>{
         if(err){
             res.send(403);
         }
         else{
                 User.findOne({token:req.token},async(err,doc)=>{
                     if(doc.usertype==="admin"){
                         var job=Job.findOne({_id:req.body._id},function(err,job){
                            if(doc.department==job.department){
                                Job.findOneAndRemove({_id : req.body._id}, function(err){
                                    if (!err) {
                                        res.send("job deleted");
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

 router.post('/',verifyToken, async (req, res) => {
        // First Validate The Request
        jwt.verify(req.token,'secretkey',(err,authdata)=>{
            if(err){
                res.send(err);
            }
            else{
                User.findOne({token:req.token}, async(err,user) => {
                    if(err){
                        res.send(err);
                    }
                    else{
                        if(!user){
                            res.status(400).send(err);
                        }
                        else{
                            if(user.usertype==="admin"){
                            if(user.department===req.body.department){
                                const { error } = validate(req.body);
                        let job = await Job.findOne({ qualification:req.body.qualification,salary:req.body.salary,department:req.body.department,experience:req.body.experience,role:req.body.role});
                         if (job) {
                           res.status(400).send('That Job already exisits!');
                        }
                        else 
                        {
                                // Insert the new user if they do not exist yet
                              job = new Job(_.pick(req.body, ['qualification','salary','department','experience','role','referalbonus']));
                               // res.status(200).send("job added succesfully");

                              await job.save();
                              res.json( "job added succesfully");
                            //   const token = jwt.sign({ _id: job._id }, config.get('PrivateKey'));
                            //   res.header('x-auth-token', token).send(_.pick(job, ['_id','qualification','salary','department','experience','role','referalbonus']));
                        }
                            }
                            }

                            else{
                                res.status(403).send("Not allowed to add");
                            }
                        }
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