require('dotenv').config();  // Load environment variables from .env file

const mongoose = require("mongoose");
const express = require('express');
const app = express();

// Connect to MongoDB using the environment variable MONGODB_URL
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Load your routes
const userRoutes = require("./routes/userRoute");

app.use(express.json());  // Middleware to parse JSON
app.use('/api', userRoutes);

// Start the server, using the port from the environment variable or fallback to 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server listening on port ' + port);
});
