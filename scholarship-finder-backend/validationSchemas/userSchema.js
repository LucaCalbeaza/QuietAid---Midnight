const Joi = require('joi');

const userSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),

  password: Joi.string().min(8).optional().pattern(
    new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])')
  ),

  educationLevel: Joi.string()
    .valid('highSchool', 'undergraduate', 'graduate', 'phd')
    .required(),

  currentInstitution: Joi.string().allow('', null).required(),
  GPA: Joi.number().min(0).max(4).required(),

  major: Joi.string().allow('', null),

  dateOfBirth: Joi.date().less('now').iso().required(),

  gender: Joi.string()
    .valid('Male', 'Female', 'Other', 'Prefer not to say')
    .allow('', null)
    .required(),

  location: Joi.object({
    country: Joi.string().required(),
    state: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
  }).required(),

  income: Joi.when('location.country', {
    is: Joi.string().valid('India'),
    then: Joi.number().min(0).required(),
    otherwise: Joi.number().min(0).optional().allow(null),
  }),

  casteCategory: Joi.when('location.country', {
    is: Joi.string().valid('India'),
    then: Joi.string()
      .valid('General', 'OBC', 'SC', 'ST', 'EWS', 'Other')
      .required(),
    otherwise: Joi.string().valid('General', 'OBC', 'SC', 'ST', 'EWS', 'Other').optional().allow(null),
  }),

  profileImage: Joi.string().uri().allow('', null),
  emailVerification: Joi.boolean().optional(),
  createdAt: Joi.date().optional(),
});

module.exports = userSchema;
