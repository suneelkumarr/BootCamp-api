const jwt = require("jsonwebtoken");
const asyncHandler = require('./async');
const errorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const STATUS_CODES = require("http-response-status-code");

exports.protect = asyncHandler (async (req, res, next) => {
    let token;

    if( req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }else if(req.cookies.token){
        token = req.cookies.token;
    }

    if(!token){
        return next(new ErrorResponse("Not Authorized!", STATUS_CODES.UNAUTHORIZED))
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch(error){
        return next(
            new errorResponse("Not Authorized!", STATUS_CODES.UNAUTHORIZED)
        )
    }
});

// Grant access roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(
                new errorResponse(
                    `User role ${req.user.role} has no access to this route`,
                    STATUS_CODES.UNAUTHORIZED
                )
            );
        }
        next();
    };
};

