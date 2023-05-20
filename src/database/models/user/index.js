
const { default: mongoose } = require('mongoose');
const UserSchema = require('../../schemas/user');

module.exports = {
    UserModel: mongoose.model('UserModel', UserSchema),
}