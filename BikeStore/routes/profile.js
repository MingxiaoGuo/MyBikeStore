/**
 * Created by Mingxiao on 01/19/2017.
 */
var express = require('express');
var router = express.Router();

module.exports = function (passport) {
    router.get('/', isLoggedIn, function (req, res) {
        res.render('pages/profile', { user : req.user });
    });

    router.get('/edit', function (req, res) {
        // different login methods require different ways to edit profile
        if (req.isAuthenticated()) {
            res.render('pages/editUserProfile', { user : req.user});
        } else {
            res.redirect('/login');
        }
    });

    return router;
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        //console.log("in isLoggedIn, check req is authenticate or not");
        return next();
    }
    res.redirect('/login');
}