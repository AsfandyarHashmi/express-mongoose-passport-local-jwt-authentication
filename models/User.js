var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    hash: {
        type: String,
        required: true
    }
});

schema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.hash);
}

schema.methods.genJwt = function() {
    var token = jwt.sign({
        'id': this._id,
        'username': this.username
      }, process.env.SECRET);
    return token;
}

module.exports = mongoose.model('User', schema);
