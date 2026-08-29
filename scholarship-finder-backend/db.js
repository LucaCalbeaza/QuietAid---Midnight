const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/scholarship-finder');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
