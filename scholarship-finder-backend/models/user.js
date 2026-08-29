const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value) => isEmail(value),
      message: 'Invalid email format',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  educationLevel: {
    type: String,
    enum: ['highSchool', 'undergraduate', 'graduate', 'phd'],
    required: [true, 'Education level is required'],
  },
  currentInstitution: {
    type: String,
    required: [true, 'Current institution is required'],
    trim: true,
  },
  GPA: {
    type: Number,
    min: [0.0, 'GPA cannot be less than 0.0'],
    max: [4.0, 'GPA cannot exceed 4.0'],
    default: null,
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    default: 'Prefer not to say',
  },
  major: {
    type: String,
    trim: true,
    default: '',
  },
  profileImage: {
    type: String,
    default: 'default-profile-image.jpg',
  },
  emailVerification: {
    type: Boolean,
    default: false,
  },
  income: {
    type: Number,
    min: 0,
    default: null,
  },
  casteCategory: {
    type: String,
    enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'],
    default: null,
  },
  location: {
    country: { type: String, required: true, trim: true },
    state: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
