const { default: mongoose } = require('mongoose');
const RefreshTokenSchema = require('../../schemas/refreshToken');

module.exports = {
    RefreshTokenModel: mongoose.model('RefreshTokenModel', RefreshTokenSchema),
}