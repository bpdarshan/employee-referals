const Joi = require('joi');
const bcrypt = require('bcryptjs');
const nodemailer=require('nodemailer');
const _ = require('lodash');
const { User} = require('../models/user');
const express = require('express');
const jwt= require('jsonwebtoken');
const router = express.Router();

// router.use(function(req, res, next) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers");
//     next();
//   });

// var cors = require('cors')
// router.use(cors())
// router.options('*', cors())

router.post('/', async  (req, res) => {
    // First Validate The HTTP Request
    const { error } = validate(req.body);
    if (error) {
        res.send(error.details[0].message);
    }
 
    //  Now find the user by their email address
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
       
         res.send('Incorrect email or password');
    }

 
    // Then validate the Credentials in MongoDB match
    // those provided in the request
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        console.log(req.body.email,req.body.password);
         res.send('Incorrect email or password.');
    }
    if(user){
        let payload = {
            name: user.name,
            email: user.email,
            uid: user.uid
        }
        jwt.sign(payload,'secretkey',(err,token)=>{
            User.findOneAndUpdate({email:req.body.email},{$set:{token:token}},{new: true}, (err, doc)=>{
                if(err){
                    res.send(err);
                }
                res.json({token,usertype: doc.usertype});
            });
            

        });
        
    }
});

router.post('/forgotpassword',async (req,res)=>{
 let user =  await User.findOne({email:req.body.email})
 if(!user){
     res.send('Enter the valid email');
 }
 else{
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
        subject: ' Reset your password  ',
        text : 'Enter the pasword properly ',
        html : `<!DOCTYPE html>
                <html lang='en'>
                <head>
                <style>
                .hidden_clip {
                    clip: rect(1px 1px 1px 1px);
                    clip: rect(1px, 1px, 1px, 1px);
                    position: absolute;
                  }
                  .form__field__wrapper {
                    position: relative;
                  }
                  .show-hide-password {
                    background: 0;
                    border: 0;
                    cursor: pointer;
                    min-height: 60px;
                    min-width: 70px;
                    padding: 18px;
                    position: absolute;
                    right: 0;
                    top: 14px;
                  }
                  
                </style>
                </head>
                <body>
                <div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">

                <fieldset class="required form__change-password">
                    <legend class="form__legend">
                    Password details </legend>
                    <div class="form__field__wrapper form-item">
                    <label for="edit-old-pass" class="text-input__label--floated">Old password <span class="form-required" aria-hidden="true" title="This field is required.">*</span><span class="hidden_clip">a required field.</span></label>
                    <input class="form-control form-text password__field text-input__field--floated required" type="password" id="edit-old-pass" name="old_pass" size="60" maxlength="128" aria-required="true">
                    

                    </div>
                    <div class="form__field__wrapper form-item">
                    <label for="edit-new-pass" class="text-input__label--floated">New password <span class="form-required" aria-hidden="true" title="This field is required.">*</span><span class="hidden_clip">a required field.</span></label>
                    <input class="form-control form-text password__field text-input__field--floated required" type="password" id="edit-new-pass" name="new_pass" size="60" maxlength="128" aria-required="true">
                    

                    </div>
                </fieldset>
                <button onclick = "forgot()">Submit</button>

                    </div>
                </body>
                <script>
                function forgot(){
                    var old = document.getElementById("edit-old-pass").value;
                    var new = document.getElementById("edit-new-pass").value;
                    if(old===new){
                        alert('')
                    }
                }
                function showHidePasswordfn() {
                    // The last span inside the button
                    var showHideBtn = $(this);
                  
                    var showHideSpan = showHideBtn.children().next();
                    var $pwd = showHideBtn.prev('input');
                  
                    // Toggle a classe called toggleShowHide to thee button
                    $(showHideBtn).toggleClass('toggleShowHide');
                    // If the button has the class toggleShowHide change the text of the last span inside it
                    showHideSpan.text(showHideBtn.is('.toggleShowHide') ? 'Hide' : 'Show');
                  
                    if ($pwd.attr('type') === 'password') {
                      $pwd.attr('type', 'text');
                    } else {
                      $pwd.attr('type', 'password');
                    }
                  }
                  
                  // On Click
                  $('.js-showHidePassword').on('click', showHidePasswordfn);
                  
                  // On Enter Key
                  $('.js-showHidePassword').keypress(function(e) {
                    // the enter key code
                    if (e.which === keyCodes.enter) {
                      showHidePasswordfn();
                    }
                  });
                </script>

                </html>`
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        res.send("Email could not sent due to error: "+error);
                        console.log('Error');
                      }else{
                        res.send("Email has been sent successfully");
                        console.log('mail sent');

                      }
                });
        }
    });

function verifyToken(req,res,next){
    const bearerHeader = req.header['authorization'];
    if(typeof bearerHeader!=='undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else{
        res.sendStatus(403);
    }
}
 
function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
 
    return Joi.validate(req, schema);
}
 
module.exports = router; 
