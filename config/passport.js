//requiring the necassary packages for bthe authentication system
const passport = require('passport');
const User = require('./../models/user');


// configuring the authetication system

LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    {usernameField:'email'},
    function (email, password, done) {
        User.findOne({ email:email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));


module.exports = passport;