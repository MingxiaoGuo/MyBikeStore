var User = require('../modules/user');
var express = require('express');
var router = express.Router();

module.exports = function (passport) {

    router.get('/', function (req, res) {
        res.render('pages/register', {message: req.flash('signupMessage')});
    });

    router.post('/', passport.authenticate('local-register', {
        successRedirect: '/login',
        failureRedirect: '/register',
        failureFlash: true
    }));

    router.post('/', passport.authenticate('admin-register', {
        successRedirect: '/login',
        failureRedirect: '/register',
        failureFlash: true
    }));

    return router;
};