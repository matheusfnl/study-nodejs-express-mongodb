const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  const query = req.params.bootcampId ?
    Course.find({ bootcamp: req.params.bootcampId }) :
    Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  })
});

// @desc    Get course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(new ErrorResponse(`Course with id ${req.params.id} not found`), 404)
  }

  res.status(200).json({
    success: true,
    count: course.length,
    data: course,
  })
});

// @desc    Add course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`), 404)
  }

  const course = await Course.create({
    ...req.body,
    bootcamp: req.params.bootcampId,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`), 404)
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`), 404)
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
