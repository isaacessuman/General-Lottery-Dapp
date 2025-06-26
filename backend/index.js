require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const roundRoutes = require('./routes/round');

const app = express();
app.use(bodyParser.json());

connectDB().then(() => {
  console.log('Database connected');
}).catch(err => {
  console.error('DB connection failed', err);
});

app.use('/round', roundRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
