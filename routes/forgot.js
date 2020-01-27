// var async = require("async");
// var nodemailer = require("nodemailer");
// var crypto = require("crypto");
// // const bcrypt = require("bcryptjs");
// const User = require('../models/user');
// const express = require('express');
// const router = express.Router();
// // const waterfall=require('async-waterfall');
// // var flash = require('express-flash');

// router.post('/forgot', async(req, res, next) => {
//     async.waterfall([
//       function(done) {
//         crypto.randomBytes(20, function(err, buf) {
//           var token = buf.toString('hex');
//           done(err, token);
//         });
//       },
//       function(token, done) {
//        User.findOne({email:req.body.email}, function(err) {
//           if (!user) {
//             req.flash('error','No account with that email address exists.');
//             return res.redirect('/forgot');
//           }
//           console.log('step 1');
//           user.resetPasswordToken = token;
//           zser.save(function(err) {
//             done(err, token, user);
//           });
//         });
//       },
//       function(token, user, done) {
//         console.log('step 2');
//         var smtpTransport = nodemailer.createTransport({
//           service: 'Gmail', 
//           auth: {
//             user: 'keerthan4598@gmail.com',
//             pass: 'mohandas'
//           }
//         });
//         var mailOptions = {
//           to: user.email,
//           from: 'learntocodeinfo@gmail.com',
//           subject: 'Node.js Password Reset',
//           text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//             'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//             'http://' + req.headers.host + '/reset/' + token + '\n\n' +
//             'If you did not request this, please ignore this email and your password will remain unchanged.\n'
//         };
//         console.log('step 3');
//         smtpTransport.sendMail(mailOptions, function(err) {
//           console.log('mail sent');
//           req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
//           done(err, 'done');
//         });
//       }
//     ], function(err) {
//       if (err) return next(err);
//       res.redirect('/forgot');
//     });
//   });
  
//   router.get('/reset/:token', function(req, res) {
//     User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
//       if (!user) {
//         req.flash('error', 'Password reset token is invalid or has expired.');
//         return res.redirect('/forgot');
//       }
//       res.render('reset', {token: req.params.token});
//     });
//   });
  
//   router.post('/reset/:token', function(req, res) {
//     async.waterfall([
//       function(done) {
//         User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
//           if (!user) {
//             req.flash('error', 'Password reset token is invalid or has expired.');
//             return res.redirect('back');
//           }
//           if(req.body.password === req.body.confirm) {
//             user.setPassword(req.body.password, function(err) {
//               user.resetPasswordToken = undefined;  
//               user.save(function(err) {
//                 req.logIn(user, function(err) {
//                   done(err,token,user);
//                 });
//               });
//             })
//           } else {
//               req.flash("error", "Passwords do not match.");
//               return res.redirect('back');
//           }
//         });
//       },
//       function(user, done) {
//         var smtpTransport = nodemailer.createTransport({
//           service: 'Gmail', 
//           auth: {
//             user: 'learntocodeinfo@gmail.com',
//             pass: process.env.GMAILPW
//           }
//         });
//         var mailOptions = {
//           to: user.email,
//           from: 'learntocodeinfo@mail.com',
//           subject: 'Your password has been changed',
//           text: 'Hello,\n\n' +
//             'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
//         };
//         smtpTransport.sendMail(mailOptions, function(err) {
//           req.flash('success', 'Success! Your password has been changed.');
//           done(err);
//         });
//       }
//     ], function(err) {
//       res.redirect('/campgrounds');
//     });
//   });
// // get handler for reset token

// // router.post('/reset/:token', function(req, res, next) {
// //     async.waterfall([
// //         function(done) {
// //             User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
// //                 if (!user) {
// //                     req.flash('error', 'Password reset token is invalid or has expired.');
// //                     return res.redirect('back');
// //                 }
// //                 user.password = req.body.password;
// //                 user.resetPasswordToken = undefined;
// //                 user.save(function(err) {
// //                     req.logIn(user, function(err) {
// //                         done(err,token,user);
// //                     });
// //                 });
// //             });
// //         },
// //         function (token, user, done) {
// //             var options = {
// //                 service: 'Mailgun',
// //                 auth: {
// //                     user: 'postmaster@Sandboxxxxxxxxxxx.mailgun.org',
// //                     pass: 'xxxxxxxxxxxxxx'
// //                 }
// //             };
// //             var transporter = nodemailer.createTransport(smtpTransport(options))

// //             var mailOptions = {
// //                 to: user.email,
// //                 from: 'postmaster@Sandbox65b418bcf76c4a5e909aedb7b6e87b45.mailgun.org',
// //                 subject: 'Your password has been changed',
// //                 text: 'Hello,\n\n' +
// //                 'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
// //             };
// //             transporter.sendMail(mailOptions, function(err) {
// //                 req.flash('success', 'Success! Your password has been changed.');
// //                 done(err);
// //             });
// //         }
// //     ], function(err) {
// //         res.redirect('/');
// //     });
// // });


//   module.exports = router;