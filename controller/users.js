const User = require('../models/User')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse');

exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        sucess: true,
        data: user
    });
})


exports.getUsers = asyncHandler(async (req, res, next) =>{
    res.status(200).json(res.advancedResults);
})

