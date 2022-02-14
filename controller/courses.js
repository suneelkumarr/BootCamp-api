const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const STATUS_CODES = require("http-response-status-code");

// @desc    Get all Courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(STATUS_CODES.OK).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } else {
    res.status(STATUS_CODES.OK).json(res.advancedResults);
  }
});

// @desc    Get course by Id
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourseById = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description"
  });

  if (!course) {
    return next(
      new ErrorResponse(
        `Course id:${req.params.id} not found`,
        STATUS_CODES.BAD_REQUEST
      )
    );
  }

  res.status(STATUS_CODES.OK).json({
    success: true,
    data: course
  });
});

// @desc    Create new Course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.params.bootcampId = req.body.bootcamp;
 const userId = req.body.user;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp id:${req.params.bootcampId} not found`,
        STATUS_CODES.BAD_REQUEST
      )
    );
  }


  if (bootcamp.user.toString() !== userId && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `Course can only be created by owner`,
        STATUS_CODES.UNAUTHORIZED
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(STATUS_CODES.CREATED).json({
    success: true,
    data: course
  });
});

// @desc    Update Course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(
        `Course id:${req.params.id} not found`,
        STATUS_CODES.BAD_REQUEST
      )
    );
  }

  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `Course can only be updated by owner`,
        STATUS_CODES.UNAUTHORIZED
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(STATUS_CODES.OK).json({
    success: true,
    data: course
  });
});

// @desc    Delete Course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(
        `Course id:${req.params.id} not found`,
        STATUS_CODES.BAD_REQUEST
      )
    );
  }

  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `Course can only be Deleted by owner`,
        STATUS_CODES.UNAUTHORIZED
      )
    );
  }

  await course.remove();

  res.status(STATUS_CODES.OK).json({
    success: true,
    data: {}
  });
});