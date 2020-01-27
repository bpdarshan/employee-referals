const _ = require('lodash');
const nodemailer=require('nodemailer');
const mongoose = require('mongoose');
const {Referal,validate} = require('../models/referals');
const {Job} = require('../models/job');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const bcrypt = require("bcryptjs");
const { User} = require('../models/user');
const {Counter} = require('../models/counter');
const fs = require('fs');
const config = require('config');
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
  
  //the admin can view their department referals
  router.get('/show_referals',verifyToken,async (req, res)=>{
    jwt.verify(req.token,'secretkey',(err,authdata)=>{
        if(err){
            res.send(403);
        }
        else{
            var admin=User.findOne({token:req.token},(err,admin)=>{
                if(err){
                    res.send(err);
                }
                else{
                    if(admin.usertype==="admin"){
                        var referee = Referal.find({department :admin.department}, (err, referee) => {
                            if(err){
                                 res.status(400).send(err);
                            }else{
                                res.status(200).send(referee);
                            }
                       
                         });
                    }
                    else{
                        res.status(403).send("not allowed to access");
                    }
                   
                }
                
            });
        }

    });
        
            
      
        
});


router.get('/resumes',verifyToken,(req, res)=>{
    jwt.verify(req.token,'secretkey',(err,authdata)=>{
        if(err){
            res.status(400).send(err);
        }
        else{
            var admin=User.findOne({token:req.token},(err,admin)=>{
                if(err){
                    res.send(err);
                }
                else{
                    
                    if(admin.usertype==="admin"){
                       res.send('resumes sent');
                    }
                    else{
                        res.status(403).send("not allowed to access");
                    }
                   
                }
                
            });
        }

    });
        
            
      
        
});
//employee are referring peoples for jobs
    router.get('/emp_referals',verifyToken, (req, res)=>{
        jwt.verify(req.token,'secretkey',(err,authdata)=>{
            if(err){
                res.send(err);
            }
            else{
                var user = User.findOne({token:req.token},(err,user)=>{
                    if(err){
                        res.send(err);
                    }
                    else{
                        if(user.usertype==="employee"){
                            var referee = Referal.find({referee_id:user.uid} ,(err, referee) => {
                                if(err){
                                     res.status(400).send(err);
                                }else if(referee[0]){
                                    res.status(200).send(referee);
                                }else{
                                    res.status(200).send("No data");
                                }
                           
                             });
                        }
                        else{
                            res.status(403).send("no data");
                        }

                    }
                });
            }
        });
        // var filter = {};
        // if(req.body.searchby == "department"){
        //     filter = {
        //         referee_id : req.body.referee_id,
        //         department : req.body.department
        //     }
        // }else{
        //     filter = {referee_id : req.body.referee_id}
        // }
       
  
    
});

router.post('/update',verifyToken,async (req,res) =>{
    jwt.verify(req.token,'secretkey',(err,authdata)=>{
        if(err){
            res.send(err);
        }
        else{
            var docu = User.findOne({token:req.token},(err,docu)=>{
                if(err){
                    res.send(err);
                }
                else{
                    if(docu.usertype==="admin"){
                        mongoose.set('useFindAndModify', false);
                        Referal.findOneAndUpdate({_id: req.body._id}, {$set:{status:req.body.status}}, {new: true}, (err, doc) => {
                            if (err) {
                                // console.log("Something wrong when updating data!");
                                res.send( err);
                            }else{
                                if(doc.status.isHired){
                                    var job = Job.findOne({_id : doc.job_id}, (err, job) => {
                                        if(err){
                                            res.send(err);
                                        }else{
                                            // console.log(doc.referee_id);
                                            User.findOneAndUpdate({uid : doc.referee_id}, {$inc : {referred : 1, points:job.referalbonus}}, {new : true}, (err, test) => {
                                                // doc.save();
                                                // console.log(doc.points);
                                                if(err){
                                                    res.send(err);
                                                }
                    
                                            });
                                            // console.log(User.find({uid : doc.referee_id}));
                                        }
                                    });
                                }
                                res.status(200).send(doc)
                            }
                        
                            // console.log(doc);
                        });
                    }
                    else{
                        res.status(403).send("not accessable");
                    }
                }
            });
        }
    });
   
    

 
});

router.post('/addreferee',verifyToken,async (req, res) => {
    jwt.verify(req.token,'secretkey',(err,authdata)=>{
        if(err){
            res.send(err);
        }
        else{
            var docu = User.findOne({token:req.token},async(err,docu)=>{
                if(err){
                    res.send(err);
                }
                else{
                    if(docu.usertype==="employee"){
                                                    // First Validate The Request
                        const { error } = validate(req.body);
                        if (error) {
                            res.status(400).send(error.details[0].message);
                        }
                        // Check if this referee already exisits
                       
                        var ref = await Referal.findOne({ email: req.body.email, job_id:req.body.job_id});
                    
                        if (ref) {
                            res.status(400).send('That referee already exisits!');
                        } else {
                            // Insert the new referee if they do not exist yet
                            
                            // ref = new Referal(req.body, ['name', 'email','phone','qualification','job','status','referee_id','referred_on','job_id','department']);
                            ref = new Referal({
                                "name":req.body.name,
                                "email":req.body.email,
                                "phone":req.body.phone,
                                "qualification":req.body.qualification,
                                "job":req.body.job,
                                "status":req.body.status,
                                "referee_id":docu.uid,
                                "referred_on":req.body.referred_on,
                                "job_id":req.body.job_id,
                                "department":req.body.department
                            });
                            await ref.save();
                            res.send("refeered");
                            // res.send(_.pick(ref, ['_id','name', 'email','phone','qualification','job','referee_id','referred_on','status','job_id','department']));
                        }
                    let transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: {
                                user: 'pacewisdom1234@gmail.com',
                                pass:'pace@123'
                            }
                        });
                        
                        var mailOptions = {
                            from: 'pacewisdom1234@gmail.com',
                            to: req.body.email,
                            subject: ' Congratulations on being referred ',
                            text : 'You have been referred for job, if your instersted upload your resume to this ',
                            html : `<!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                                <style>
                                *{
                                    margin: 20px;
                                    padding: 20px;
                                    text-decoration: none;
                                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                    box-sizing : border-box;
                                    
                                }
                                        
                                .login-form{
                                    width:360px;
                                    height: 500px;
                                    background:white;
                                    padding:80px 40px;
                                    border-radius: 10px;
                                    position: absolute;
                                    top:50%;
                                    left:50%;
                                    transform: translate(-50% ,-50%);
                                }
                                .login-form h2{
                                    text-align: center;
                                    margin-bottom: 60px; 
                                }
                                
                                </style>
                                
                            
                                <title>Upload File</title>
                            </head>
                            <body>
                               <div  class="login-form">
                                   <h2>Upload Resume</h2>
                            
                                   
                                <form action="file"  method="post" enctype="multipart/form-data">
                                
                               <p> <input type="file" name="file"></p>
                               <br>
                            
                               <p> <input type="submit"  name="Upload" value="Upload File"></p>
                                </form>
                                
                            </div>     
                            </body>
                            </html>`
                            // text: 'That was easy!'
                        };
                        
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                            console.log(error);
                            } else {
                            console.log('Email sent: ' + info.response);
                            }
                        });
                    }
                    else{
                        res.status(403).send("not allowed to access");
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