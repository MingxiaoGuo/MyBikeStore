var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    admin: {
        email: String,
        password: String
    },
    local: {
        email: String,
        name: String,
        password: String,
        profilePhoto: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String,
        profilePhoto: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String,
        profilePhoto: String
    }
});

/*
 * Generate hashed password using bcrypt
 * [invoked in the defination of passport.localStrategy.signup]
 */
userSchema.methods.generateHash = function (plainPassword) {
    return bcrypt.hashSync(plainPassword, bcrypt.genSaltSync(8));
};

/*
 * Compare plain text password to password that DB stores
 * [invoked in the defination of passport.localStrategy.signin]
 */
userSchema.methods.validatePassword = function (plainPassword) {
    return bcrypt.compareSync(plainPassword, this.local.password);
};

userSchema.methods.validatePasswordForAdmin = function (plainPassword) {
    return bcrypt.compareSync(plainPassword, this.admin.password);
};

module.exports = mongoose.model('User',userSchema);