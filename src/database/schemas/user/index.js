const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const USER_PERMISSIONS = [
    'student',
    'admin',
    'alumni'
]

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
        validate: {
            validator: async function (value) {
                const userModel = this.constructor;

                const user = await userModel.findOne({ username: value });

                return Boolean(!user);
            },
            message: (props) => {
                return `The username ${props.value} is already been used.`;
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    permission: {
        type: String,
        required: true,
        enum: USER_PERMISSIONS,
    }
});

UserSchema.pre('save', async function (next) {
    try {
        let hashedPassword = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);

        this.password = hashedPassword;
    } catch (error) {
        return next(error);
    }
});

UserSchema.methods.getTokenPayload = function () {
    // we can add more to the tokens payload
    return {
        username: this.username,
    }
}

UserSchema.methods.createToken = function () {
    const accessToken = jwt.sign(this.getTokenPayload(), ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
    return accessToken;
}

UserSchema.statics.authenticate = async function (username, password) {
    try {
        const user = await this.findOne({ username: username });
        if (!user)
            return null;

        let matched = await bcrypt.compare(password, user.password);

        if (matched)
            return user;

        return null;
    } catch (error) {
        return null;
    }
}

UserSchema.statics.verifyToken = async function (token) {
    try {
        const UserModel = this;
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

        let user = await UserModel.findOne({ username: decoded.username }); // this assumes that the token payload has username prop

        return user;
    } catch (error) {
        return null;
    }
}

module.exports = UserSchema;