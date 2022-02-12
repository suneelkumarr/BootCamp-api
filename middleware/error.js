// const ErrorResponse = require('../utils/errorResponse');
// const STATUS_CODES = require('http-responce-status-code');

// const errorHandler = (err, req, res, next) => {
//     let error = { ...err};
//     error.message = err.message;

//     if(err.name === 'CastError'){
//         const message = `Resource with id ${err.value} not found`;
//         error = new ErrorResponse(message, STATUS_CODES.NOT_FOUND);
//     }

//     if (err.name === "ValidationError") {
//         const message = Object.values(err.errors).map(val => val.message);
//         error = new ErrorResponse(message, STATUS_CODES.BAD_REQUEST);
//       }
    
//       if (err.code === 11000) {
//         const message = `Dublicate field entered`;
//         error = new ErrorResponse(message, STATUS_CODES.BAD_REQUEST);
//       }

//       res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         err: error.message || "Server Error"
//       });

// }

// module.exports = errorHandler;

const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for dev
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;