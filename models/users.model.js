var mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");
var Schema = mongoose.Schema;

var model = new Schema({
    username: String,
    comments: [{ body: String, date: Date }],
    _created: { type: Date, default: Date.now },
    displayName: String,
    avatar: String,
    password: { type: String, select: false },
    signUpDate: { type: Date, default: Date.now() },
    lastLogin: Date
});

model.pre('save', function (next) {
    let user = this;
    console.log(this);
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);

            user.password = hash
            next()
        });

    });
});

model.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch)
    });
}

var UserModel = mongoose.model('Users', model);

module.exports = UserModel;