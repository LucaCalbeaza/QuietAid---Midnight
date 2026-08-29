import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from '../utils/axiosInstance';
import '../styles/form.css';
import { useNavigate } from 'react-router-dom';

const casteOptions = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'];
const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Must include uppercase, lowercase, number, and special character'
    )
    .required('Password is required'),
  educationLevel: Yup.string()
    .oneOf(['highSchool', 'undergraduate', 'graduate', 'phd'])
    .required('Education level is required'),
  currentInstitution: Yup.string().notRequired(),
  GPA: Yup.number()
    .min(0, 'GPA cannot be negative')
    .max(4, 'GPA cannot exceed 4.0')
    .typeError('GPA must be a number')
    .nullable()
    .transform((value, originalValue) =>
      originalValue === '' ? null : parseFloat(originalValue)
    )
    .required('GPA is required'),
  dateOfBirth: Yup.date()
    .max(new Date(), 'Date of birth must be in the past')
    .required('Date of birth is required'),
  location: Yup.object().shape({
    country: Yup.string().required('Country is required'),
    state:   Yup.string(),
    city:    Yup.string(),
  }),
  gender: Yup.string()
    .oneOf(genderOptions, 'Please select a valid gender option')
    .required('Gender is required'),
  income: Yup.number()
    .min(0, 'Income cannot be negative')
    .when('location.country', {
      is: 'India',
      then: (schema) =>
        schema.required('Income is required for Indian users'),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
  casteCategory: Yup.string()
    .oneOf(casteOptions, 'Please select a valid caste category')
    .when('location.country', {
      is: 'India',
      then: (schema) =>
        schema.required('Caste category is required for Indian users'),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
});

const RegistrationForm = ({ onRegisterSuccess }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const navigate = useNavigate();
  const country = watch('location.country');

  const onSubmit = async (data) => {
  console.log('Submitting data:', JSON.stringify(data, null, 2)); 
  try {
    await axios.post('/auth/register', data);
    onRegisterSuccess?.();
    navigate('/dashboard');
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    alert('Registration failed. Check console for details.');
  }
};


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <h2>Create Your Profile</h2>

      {[
        ['First Name', 'firstName'],
        ['Last Name', 'lastName'],
        ['Email', 'email', 'email'],
        ['Password', 'password', 'password'],
        ['Current Institution', 'currentInstitution'],
        ['GPA', 'GPA', 'number', { step: 0.1 }],
        ['Date of Birth', 'dateOfBirth', 'date'],
      ].map(([label, name, type = 'text', extra = {}]) => (
        <div className="form-group" key={name}>
          <label>{label}</label>
          <input type={type} {...register(name)} {...extra} />
          {errors[name] && (
            <span className="error-message">{errors[name].message}</span>
          )}
        </div>
      ))}

      <div className="form-group">
        <label>Education Level</label>
        <select {...register('educationLevel')}>
          <option value="">Select your education level</option>
          <option value="highSchool">High School</option>
          <option value="undergraduate">Undergraduate</option>
          <option value="graduate">Graduate</option>
          <option value="phd">PhD</option>
        </select>
        {errors.educationLevel && (
          <span className="error-message">
            {errors.educationLevel.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label>Country</label>
        <input {...register('location.country')} />
        {errors.location?.country && (
          <span className="error-message">
            {errors.location.country.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label>State</label>
        <input {...register('location.state')} />
      </div>

      <div className="form-group">
        <label>City</label>
        <input {...register('location.city')} />
      </div>

      <div className="form-group">
        <label>Gender</label>
        <select {...register('gender')}>
          <option value="">Prefer not to say</option>
          {genderOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.gender && (
          <span className="error-message">{errors.gender.message}</span>
        )}
      </div>

      {country === 'India' && (
        <>
          <div className="form-group">
            <label>Annual Income (INR)</label>
            <input type="number" step="10000" {...register('income')} />
            {errors.income && (
              <span className="error-message">{errors.income.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Caste Category</label>
            <select {...register('casteCategory')}>
              <option value="">Select category</option>
              {casteOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.casteCategory && (
              <span className="error-message">
                {errors.casteCategory.message}
              </span>
            )}
          </div>
        </>
      )}

      <button type="submit">Create Profile</button>
    </form>
  );
};

export default RegistrationForm;
