const mongoose = require('mongoose');
const slugify = require('slugify');

const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Provide a name in orden to continue'],
    unique: true,
    trim: true,
    maxLength: [50, 'Name has a maximum length of 50 characters'],
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Provide a description in orden to continue'],
    maxLength: [500, 'Description has a maximum length of 500 characters'],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Provide a valid URL in order to continue',
    ]
  },
  phone: {
    type: String,
    maxLength: [20, 'Phone number has a maximum length of 20 characters.'],
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Provide a valid email in order to continue',
    ]
  },
  address: {
    type: String,
    required: [true, 'Provide a valid address in order to continue'],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
      index: '2dsphere',
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other',
    ],
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating must can not be more than 10']
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Bootcamp slug from name
BootcampSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
})

// Create Geocode fields
BootcampSchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  }

  this.address = undefined;
  next();
})

// Cascade delete courses when delete a bootcamp
BootcampSchema.pre('deleteOne', { virtuals: true }, async function (next) {
  console.log(`Courses being removed from bootcamp ${this._conditions._id}`);

  await mongoose.model('Course').deleteMany({ bootcamp: this._conditions._id });

  next();
});

// Reserve populate with virtuals
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false,
})

module.exports = mongoose.model('Bootcamp', BootcampSchema);
