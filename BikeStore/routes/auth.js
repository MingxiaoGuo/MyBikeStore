/**
 * Created by Mingxiao on 01/23/2017.
 */
var express = require('express');
var router = express.Router();

module.exports = function (passport) {

    router.get('/facebook', passport.authenticate('facebook', { scope: 'email'}));

    router.get('/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/profile',
                                            failureRedirect: '/login' }));

    router.get('/google', passport.authenticate('google', { scope: [ 'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read'] }));

    router.get('/google/callback',
        passport.authenticate('google', { successRedirect: '/profile',
                                            failureRedirect: '/login'}));

    return router;
}

