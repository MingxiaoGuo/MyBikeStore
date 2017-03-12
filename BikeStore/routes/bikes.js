var express = require("express");
var router = express.Router();

module.exports = function (passport) {
  router.get('/', function (req, res) {
    console.log(passport);
    if (passport === undefined) {
        res.render('pages/bikes');
    } else {
        res.render('pages/bikes', { user : req.user });
    }
  });

  return router;
}
