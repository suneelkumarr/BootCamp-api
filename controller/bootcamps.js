const path = require("path");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geoCoder = require("../utils/geocoder");
const STATUS_CODES = require("http-response-status-code");
const User = require('../models/User')

// @desc    Get all Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(STATUS_CODES.OK).json(res.advancedResults);
});

// @desc    Get a single Bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp id:${req.body.id} not found`,
        STATUS_CODES.BAD_REQUEST
      )
    );
  }

  res.status(STATUS_CODES.OK).json({
    success: true,
    data: bootcamp
  });
});

// @desc    Create new Bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // Add user
  req.body.user = req.body.user;
  let user = await User.findById(req.body.user);
  if (!user) {
    return next(
      new ErrorResponse(
        `User id:${req.body.user} not found`,
        STATUS_CODES.BAD_REQUEST
      )
    );
  }
  // Check for Published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.body.user });

  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `You cannot create more than 1 bootcamp`,
        STATUS_CODES.BAD_REQUEST
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);
  res.status(STATUS_CODES.CREATED).json({
    success: true,
    data: bootcamp
  });
});

// @desc    Update Bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp id:${req.params.id} not found`,
        STATUS_CODES.BAD_REQUEST
      )
    );
  }

  let user = await User.findById(req.body.user);
  if (!user) {
    return next(
      new ErrorResponse(
        `User id:${req.body.user} not found`,
        STATUS_CODES.BAD_REQUEST
      )
    );
  }


  if (bootcamp.user.toString() !== req.body.user && req.body.role !== "admin") {
    return next(
      new ErrorResponse(
        `Bootcamp can only be updated by owner`,
        STATUS_CODES.UNAUTHORIZED
      )
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(STATUS_CODES.OK).json({
    success: true,
    data: bootcamp
  });
});

// @desc    Delete Bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp id:${req.params.id} not found`,
        STATUS_CODES.BAD_REQUEST
      )
    );
  }

  if (bootcamp.user.toString() !== req.body.user && req.body.role !== "admin") {
    return next(
      new ErrorResponse(
        `Bootcamp can only be removed by owner`,
        STATUS_CODES.UNAUTHORIZED
      )
    );
  }

  bootcamp.remove();

  res.status(STATUS_CODES.OK).json({
    success: true
  });
});

// @desc    Get Bootcamps  within radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const loc = await geoCoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(STATUS_CODES.OK).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

// @desc    Upload Photo
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.uploadPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp id:${req.params.id} not found`,
        STATUS_CODES.BAD_REQUEST
      )
    );
  }

  let user = await User.findById(req.body.user);
  if (!user) {
    return next(
      new ErrorResponse(
        `User id:${req.body.user} not found`,
        STATUS_CODES.BAD_REQUEST
      )
    );
  }


  if (bootcamp.user.toString() !== req.body.user && req.body.role !== "admin") {
    return next(
      new ErrorResponse(
        `Bootcamp picture can only be updated by owner`,
        STATUS_CODES.UNAUTHORIZED
      )
    );
  }

  if (!req.files) {
    return next(
      new ErrorResponse(`Photo not uploaded`, STATUS_CODES.BAD_REQUEST)
    );
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith("image/")) {
    return next(
      new ErrorResponse(`Please upload a picture`, STATUS_CODES.BAD_REQUEST)
    );
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Size is too big`, STATUS_CODES.BAD_REQUEST));
  }

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  console.log(`${process.env.FILE_UPLOAD_PATH}/${file.name}`);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Upload error`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: file.name
    });
  });
});