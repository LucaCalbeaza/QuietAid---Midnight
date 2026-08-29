require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const scholarshipRoutes = require('./routes/scholarship');
const userRoutes = require('./routes/user');
const sentimentRoutes = require('./routes/sentiment');
const recommendationsRoutes = require('./routes/recommendations');
const isAuth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Welcome to Scholarship Finder Backend');
});

// Mounting Routes
app.use('/api/scholarships/recommendations', recommendationsRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sentiment', sentimentRoutes);

app.get('/api/protected', isAuth, (req, res) => {
  res.json({ message: 'Access granted to protected route!' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
