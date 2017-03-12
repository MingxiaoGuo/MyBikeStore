/**
 * Created by Mingxiao on 2/9/2017.
 */
var express = require('express');
var router = express.Router();

module.exports = function (passport) {
    /**
     * Render Overview Dashboard
     */
    router.get('/', function (req, res) {
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

    /**
     *
     */
    router.get("/createServer", function () {
        console.log("in create server");
    });

    return router;
};
