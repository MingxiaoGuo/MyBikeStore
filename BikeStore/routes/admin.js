var express = require('express');
var router = express.Router();

module.exports = function (passport) {
    router.get('/', function(req, res) {
        if (typeof req.user === 'undefined') {
            res.render('pages/adminLogin', {message: req.flash('signinMessage')});
        } else {
            res.render('pages/admin', { user : req.user });
        }
    });

    /* [GET] admin login */
    router.get('/login', function (req, res) {
        if (passport.isAuthenticated) {
            console.log(req.user);
            res.render('pages/admin', {message: req.flash('signinMessage'), user : req.user });
        } else {
            res.render('pages/adminLogin', {message: req.flash('signinMessage')});
        }
    });

    /* [POST] admin login */
    router.post('/login', passport.authenticate('admin-signin', {
        successRedirect: '/admin',
        failureRedirect: '/admin/login',
        failureFlash: true
    }));

    /* [GET] server management */
    router.get('/serverManagement', function (req, res) {
        if (req.isAuthenticated()) {
            console.log('authenticated!');
            var serverList = [
                {
                    location: "California",
                    status: "stopped",
                    instance_type: "t2-micro",
                    cost: 2
                },
                {
                    location: "California",
                    status: "running",
                    instance_type: "t2-micro",
                    cost: 2
                },
                {
                    location: "California",
                    status: "running",
                    instance_type: "t2-micro",
                    cost: 2
                }
            ];

            var loadBalancer = {
              attribute1: "value1",
              attribute2: "value2",
              attribute3: "value3"
            };

            res.render('pages/serverManagement', {user: req.user, serverList: serverList, loadBalancer: loadBalancer});
        } else {
            console.log('not authed');
            res.redirect('/admin/login');
        }
    });

    /* [GET] product management */
    router.get('/productManagement', function (req, res) {
        if (typeof req.user === 'undefined') {
            res.render('pages/adminLogin', {message: req.flash('signinMessage')});
        } else {
            /* TODO: get product list from server */
            var productList = [
              {
                productName: "product1",
                productPics: [
                  "../images/santa_cruz_nomad.jpg",
                  "url2"
                ],
                productPrice: "2999.99",
                productInventory: "200"
              },
              {
                productName: "product2",
                productPics: [
                  "../images/santa_cruz_bronson.jpg",
                  "url2"
                ],
                productPrice: "12999.99",
                productInventory: "100"
              },
              {
                productName: "Enduro Elite Carbon 650b",
                productPics: [
                  "../images/specialized_166687.jpg",
                  "url2"
                ],
                productPrice: "12999.99",
                productInventory: "50"
              }
            ]
            res.render('pages/productManagement', { user : req.user, productList : productList });
        }
    });

    return router;
};
