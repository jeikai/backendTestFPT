require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const routes = require('./routes');

const app = express();

app.use(cors()); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', routes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something broke!'
  });
});

const PORT = 5000;
app.listen(5000, () => {
  console.log(`Server is running on port ${PORT}`);
});