const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Provide a title in orden to continue'],
  },
  description: {
    type: String,
    required: [true, 'Provide a description in orden to continue'],
  },
  weeks: {
    type: String,
    required: [true, 'Provide a number of weeks in orden to continue'],
  },
  tuition: {
    type: Number,
    required: [true, 'Provide a tuition cost in orden to continue'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Provide a minimum skill in orden to continue'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: [true, 'Course must belong to a bootcamp'],
  },
});

module.exports = mongoose.model('Course', CourseSchema);
