import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';

const casteOptions = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'];
const genderOptions = ['Male', 'Female', 'Other'];
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
];

const EditProfileForm = ({ userId }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    educationLevel: '',
    currentInstitution: '',
    GPA: '',
    major: '',
    dateOfBirth: '',
    gender: '',
    income: '',
    casteCategory: '',
    location: {
      country: '',
      state: '',
      city: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`/users/${userId}`);
        const user = res.data;
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          educationLevel: user.educationLevel || '',
          currentInstitution: user.currentInstitution || '',
          GPA: user.GPA ?? '',
          major: user.major || '',
          dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
          gender: user.gender || '',
          income: user.income ?? '',
          casteCategory: user.casteCategory || '',
          location: {
            country: user.location?.country || '',
            state: user.location?.state || '',
            city: user.location?.city || '',
          },
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      gender: formData.gender || '',
      major: formData.major || '',
    };

    console.log('Submitting payload:', payload); 

    try {
      await axios.put(`/users/${userId}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: 'Failed to update profile' });
    }
  };

  if (loading) return <div>Loading...</div>;

  const isIndian = formData.location.country === 'India';

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Edit Your Profile</h2>
      {errors.general && <div className="error-message">{errors.general}</div>}

      {[['First Name', 'firstName'],
        ['Last Name', 'lastName'],
        ['Email', 'email', 'email'],
        ['Current Institution', 'currentInstitution'],
        ['GPA', 'GPA', 'number'],
        ['Major', 'major'],
        ['Date of Birth', 'dateOfBirth', 'date']
      ].map(([label, name, type = 'text']) => (
        <div className="form-group" key={name}>
          <label>{label}</label>
          <input
            name={name}
            type={type}
            value={formData[name]}
            onChange={handleChange}
            required
          />
        </div>
      ))}

      <div className="form-group">
        <label>Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select gender</option>
          {genderOptions.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Education Level</label>
        <select
          name="educationLevel"
          value={formData.educationLevel}
          onChange={handleChange}
          required
        >
          <option value="">Select your education level</option>
          <option value="highSchool">High School</option>
          <option value="undergraduate">Undergraduate</option>
          <option value="graduate">Graduate</option>
          <option value="phd">PhD</option>
        </select>
      </div>

      <div className="form-group">
        <label>Country</label>
        <input
          name="location.country"
          value={formData.location.country}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>State</label>
        {isIndian ? (
          <select
            name="location.state"
            value={formData.location.state}
            onChange={handleChange}
            required
          >
            <option value="">Select a state</option>
            {indianStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        ) : (
          <input
            name="location.state"
            value={formData.location.state}
            onChange={handleChange}
          />
        )}
      </div>

      <div className="form-group">
        <label>City</label>
        <input
          name="location.city"
          value={formData.location.city}
          onChange={handleChange}
        />
      </div>

      {isIndian && (
        <>
          <div className="form-group">
            <label>Annual Income (INR)</label>
            <input
              name="income"
              type="number"
              value={formData.income}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Caste Category</label>
            <select
              name="casteCategory"
              value={formData.casteCategory}
              onChange={handleChange}
              required
            >
              <option value="">Select caste category</option>
              {casteOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <button type="submit">Update Profile</button>
    </form>
  );
};

export default EditProfileForm;
