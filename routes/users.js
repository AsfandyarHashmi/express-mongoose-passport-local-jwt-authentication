var express = require('express');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var router = express.Router();

var User = require('../models/User');

router.post('/create', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);

  var user = new User();
  user.username = username;
  user.hash = hash;
  user.save().then((user) => {
      res.json({
        'token': user.genJwt()
      });
    })
    .catch(err => res.status(400).json(err));
});

router.post('/login',
  passport.authenticate('local', {
    session: false
  }),
  function (req, res) {
    res.json({
      'token': req.user.genJwt()
    });
  });

  // Test for jsonwebtoken
router.get('/profile', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var profile = {
    //'id': req.user._id,
    'username': req.user.username
  };
  res.json(profile);
});

module.exports = router;