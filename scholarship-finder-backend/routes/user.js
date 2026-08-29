const express = require('express');
const router = express.Router();
const User = require('../models/user');   
const isAuth = require('../middleware/auth');

router.get('/me', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('Error fetching /users/me:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error(`Error fetching /users/${req.params.id}:`, error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', isAuth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      educationLevel,
      currentInstitution,
      GPA,
      dateOfBirth,
      gender,
      major,
      income,
      casteCategory,
      location
    } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (firstName !== undefined)        user.firstName        = firstName;
    if (lastName !== undefined)         user.lastName         = lastName;
    if (email !== undefined)            user.email            = email;
    if (educationLevel !== undefined)   user.educationLevel   = educationLevel;
    if (currentInstitution !== undefined) user.currentInstitution = currentInstitution;
    if (GPA !== undefined)              user.GPA              = GPA;
    if (dateOfBirth !== undefined)      user.dateOfBirth      = dateOfBirth;
    if (gender !== undefined)           user.gender           = gender;
    if (major !== undefined)            user.major            = major;
    if (income !== undefined)           user.income           = income;
    if (casteCategory !== undefined)    user.casteCategory    = casteCategory;
    if (location !== undefined) {
      user.location = {
        country: location.country   !== undefined ? location.country   : user.location.country,
        state:   location.state     !== undefined ? location.state     : user.location.state,
        city:    location.city      !== undefined ? location.city      : user.location.city,
      };
    }

    await user.save();
    return res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(`Error updating /users/${req.params.id}:`, error);
    return res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
