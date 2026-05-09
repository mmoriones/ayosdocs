const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuration of Cross-Origin Resource Sharing (CORS).
// Restricted access to specific trusted domains ensures better security.
app.use(cors({
  origin: [ process.env.FRONTEND_URL,
      "https://www.ayosdocs.com",
    "https://ayosdocs.com",
    "https://dev.ayosdocs.com"
  ]
}));

// Parsing of incoming JSON and URL-encoded request bodies.
app.use(express.json());
app.use(express.urlencoded( {extended: true }));

// Registration of API routes.
// Logic is delegated to separate route files for better organization.
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// Establishment of connection to MongoDB.
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));