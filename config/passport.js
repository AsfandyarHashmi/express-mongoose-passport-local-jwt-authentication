var passport = require('passport')

var LocalStrategy = require('passport-local');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var User = require('../models/User');

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
//opts.issuer = 'accounts.examplesoft.com';
//opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({
        _id: jwt_payload.id
    }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({
            username: username
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (!user.verifyPassword(password)) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
));