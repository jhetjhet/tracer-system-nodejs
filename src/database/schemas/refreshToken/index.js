const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const RefreshTokenSchema = mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
        index: true,
    }
});

RefreshTokenSchema.statics.createToken = async function (ownerID, load) {
    const RefreshTokenModel = this;

    await RefreshTokenModel.deleteOne({ owner: ownerID }); // delete previous token

    let token = jwt.sign({
        ...load,
        owner: ownerID,
    }, REFRESH_TOKEN_SECRET);

    let refreshToken = RefreshTokenModel({
        owner: ownerID,
        token,
    });

    await refreshToken.save();

    return token;
}

RefreshTokenSchema.statics.isTokenValid = async function (token) {
    try {
        const RefreshTokenModel = this;

        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);

        if(!decoded)
            return null;
        // check if token exists by searching its owner
        const refreshToken = await RefreshTokenModel.findOne({ owner: decoded.owner });

        // verify if saved token match the token
        if(refreshToken.token !== token)
            return null;

        if(!refreshToken)
            return null;

        return decoded;
    } catch (error) {
        return null;
    }
}

module.exports = RefreshTokenSchema;