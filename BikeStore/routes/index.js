var express = require('express');
var router = express.Router();

module.exports = function (passport) {
    router.get('/', function(req, res) {
        console.log("====in index render controller====", req.user);
        if (req.isAuthenticated()) {
            res.render('pages/index', { user : req.user });
        } else {
            res.render('pages/index');
        }
    });

    return router;
};
