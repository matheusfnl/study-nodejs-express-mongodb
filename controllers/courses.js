const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');

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
