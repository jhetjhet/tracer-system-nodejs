const bcrypt = require('bcrypt');
const { body } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const { validationError } = require('..');
const {
    UserModel,
} = require('../../database/models/user');
const {
    RefreshTokenModel,
} = require('../../database/models/refreshTokenModel');

const authenticateTokenMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader)
            return res.sendStatus(StatusCodes.UNAUTHORIZED);

        let match = /TOKEN\s(.+)/ig.exec(authHeader);

        if (!match)
            return res.sendStatus(StatusCodes.UNAUTHORIZED);

        const token = match[1];
        let user = await UserModel.verifyToken(token);

        if (!user)
            return res.sendStatus(StatusCodes.FORBIDDEN);

        req.user = user;

        return next();
    } catch (error) {
        return next(error);
    }
}

const create = async (req, res, next) => {
    try {
        const authData = req.body;

        let user = UserModel(authData);

        await user.save();

        return res.json(user);
    } catch (error) {
        return next(error);
    }
}

const login = [
    body('username').not().isEmpty().withMessage('This field is required.'),
    body('password').not().isEmpty().withMessage('This field is required.'),
    validationError,
    async (req, res, next) => {
        try {
            const authData = req.body;

            let user = await UserModel.authenticate(authData.username, authData.password);

            if (!user)
                return res.status(StatusCodes.UNAUTHORIZED).send("Invalid username or password.");

            let accessToken = user.createToken();
            let refreshToken = await RefreshTokenModel.createToken(user._id, user.getTokenPayload());

            return res.json({
                accessToken,
                refreshToken,
            });
        } catch (error) {
            return next(error);
        }
    },
]

const retrieve = [
    authenticateTokenMiddleware,
    (req, res) => {
        const user = req.user;
        return res.json({
            id: user._id,
            username: user.username,
            permission: user.permission,
        });
    }
]

const refresh = [
    body('token').not().isEmpty().withMessage("This field is required."),
    validationError,
    async (req, res, next) => {
        try {
            const token = req.body.token;

            const decodedToken = await RefreshTokenModel.isTokenValid(token);

            if(!decodedToken)
                return res.sendStatus(StatusCodes.UNAUTHORIZED);

            const user = await UserModel.findOne({ username: decodedToken.username });
            
            if(!user)
                return res.sendStatus(StatusCodes.UNAUTHORIZED);

            const accessToken = user.createToken();

            return res.json({
                accessToken,
            })
        } catch (error) {
            return next(error);
        }
    },
]

const verify = [
    authenticateTokenMiddleware,
    (req, res) => {
        return res.sendStatus(StatusCodes.OK);
    },
]

const logout = [
    body('token').not().isEmpty().withMessage("This field is required."),
    validationError,
    async (req, res, next) => {
        try {
            const token = req.body.token;

            const decodedToken = await RefreshTokenModel.isTokenValid(token);

            if(!decodedToken)
                return res.sendStatus(StatusCodes.UNAUTHORIZED);
            
            await RefreshTokenModel.deleteOne({ owner: decodedToken.owner });
            
            return res.sendStatus(StatusCodes.NO_CONTENT);
        } catch (error) {
            return next(error);
        }
    },
]

module.exports = {
    authenticateTokenMiddleware,
    create,
    login,
    retrieve,
    refresh,
    verify,
    logout,
}