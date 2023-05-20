const mongoose = require("mongoose");
const {
    StatusCodes,
} = require("http-status-codes");
const { validationResult } = require('express-validator');

const validationError = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const errs = errors.mapped();
        Object.keys(errs).forEach((k) => {
            errs[k].message = errs[k].msg;
            delete errs[k].msg;
        });
        return res.status(400).json(errs);
    }
    next();
}

const errorHandler = (err, req, res, next) => {
    if(err instanceof mongoose.Error.ValidationError)
        return res.status(StatusCodes.BAD_REQUEST).json(err.errors);

    if(err.code === 11000)
        return res.status(StatusCodes.BAD_REQUEST).json(err);

    return next(err);
}

function objectIDValidation(idNames){
    return (req, res, next) => {
        if(typeof idNames === "string"){
            if(!mongoose.Types.ObjectId.isValid(req.params[idNames]))
                return res.status(StatusCodes.NOT_FOUND).end();
        }
        else if(Array.isArray(idNames)){
            for(let idName of idNames)
                if(!mongoose.Types.ObjectId.isValid(req.params[idName]))
                    return res.status(StatusCodes.NOT_FOUND).end();
        }
        return next();
    }
}

module.exports = {
    validationError,
    errorHandler,
    objectIDValidation,
}