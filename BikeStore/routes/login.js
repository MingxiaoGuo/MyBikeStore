var express = require('express');
var router = express.Router();
var SHA256 = require("crypto-js/md5");

module.exports = function (passport) {

    router.get('/', function (req, res) {
        console.log("$$$$$$$$$$$$$$$$$$ encrypt: ", SHA256("Message").words);
        if (passport.isAuthenticated) {
            res.render('pages/login', {message: req.flash('signinMessage'), user : req.user });
        } else {
            res.render('pages/login', {message: req.flash('signinMessage')});
        }

    });

    router.post('/', passport.authenticate('local-signin', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));


    return router;
};