var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../modules/user');
var configAuth = require('./authentication');

module.exports = function (passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

    /**
     * [Local Register Strategy]
     */
	passport.use('local-register', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function (req, email, password, done) {
		User.findOne({'local.email': email}, function (err, user) {
			if (err) {
				return done(err)
			}
			if (user) {
				return done(null, false, req.flash('signupMessage', 'Email already taken'));
			} else {
				var newUser = new User();
				newUser.local.email = email;
				// Hash the plain text password
				newUser.local.password = newUser.generateHash(password);
				newUser.local.name = "username";
				newUser.local.profilePhoto = "../images/default_profile_pic.png";
                console.log("user get info!")
				newUser.save(function (err) {
                    if (err) {
                        console.log("cannot register![in passport]");
                        throw err;
                    }
                    console.log("registered!")
                    return done(null, newUser);
                });
			}
		});
	}));

    /**
     * [Local Login Strategy]
     */
	passport.use('local-signin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        User.findOne({'local.email': email}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, req.flash('signinMessage', 'No user found'));
            }
            if (!user.validatePassword(password)) {
                return done(null, false, req.flash('signinMessage', 'Wrong password'));
            }
            console.log("here we are in local strategy");
            return done(null, user);
        });
    }));

    /**
     * [Admin Register strategy]
     */
    passport.use('admin-register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        User.findOne({'admin.email': email}, function (err, user) {
            if (err) {
                return done(err)
            }
            if (user) {
                return done(null, false, req.flash('signupMessage', 'Email already taken'));
            } else {
                var newUser = new User();
                newUser.admin.email = email;
                // Hash the plain text password
                newUser.admin.password = newUser.generateHash(password);
                newUser.admin.name = "admin";
                console.log("admin user get info!")
                newUser.save(function (err) {
                    if (err) {
                        console.log("cannot register![in passport]");
                        throw err;
                    }
                    console.log("registered!")
                    return done(null, newUser);
                });
            }
        });
    }));

    /**
     * [Admin log-in strategy]
     */
    passport.use('admin-signin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        User.findOne({'admin.email': email}, function (err, user) {
            console.log("in admin login", email);
            console.log("in admin login", password);
            console.log(user);
            if (err) {
                console.log('in admin login error', err);
                return done(err);
            }
            if (!user) {
                return done(null, false, req.flash('signinMessage', 'No user found'));
            }
            if (!user.validatePasswordForAdmin(password)) {
                return done(null, false, req.flash('signinMessage', 'Wrong password'));
            }
            console.log("$$$$$$$$$$$$$$$$$ here we are in admin strategy");
            return done(null, user);
        });
    }));

    /**
     * [Facebook strategy]
     */
    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: ['id', 'displayName', 'photos', 'emails']
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({'facebook.id' : profile.id}, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, user);
                    } else { // no user matches, create a new user in DB
                        var newUser = new User();
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = accessToken;
                        newUser.facebook.name = profile.displayName;
                        newUser.facebook.email = profile.emails[0].value;
                        newUser.facebook.profilePhoto = profile.photos[0].value;

                        newUser.save(function (err) {
                            if (err) {
                                return done(err);
                            }
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));

    /**
     * [Google Strategy]
     */
    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        profileFields: ['id', 'displayName', 'photos', 'emails']
    }, function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
           User.findOne({ 'google.id' : profile.id }, function (err, user) {
               if (err) {
                   return done(err);
               }
               if (user) {
                   //console.log("==================================", profile);
                   return done(null, user);
               } else { // Create new record in DB
                   var newUser = new User();
                   newUser.google.id = profile.id;
                   newUser.google.token = profile.token;
                   newUser.google.email = profile.emails[0].value;
                   newUser.google.name = profile.displayName;
                   newUser.google.profilePhoto = profile.photos[0].value;

                   newUser.save(function (err) {
                       if (err) {
                           return done(err);
                       }
                       return done(null, newUser);
                   });
               }
           });
        });
    }));

}
