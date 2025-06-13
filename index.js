require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const routes = require('./routes');

const app = express();

// CORS middleware 
app.use(cors()); 

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something broke!'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});