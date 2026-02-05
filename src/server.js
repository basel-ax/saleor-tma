require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const telegramRoutes = require('./routes/telegram');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// API routes
app.use('/api', apiRoutes);
app.use('/telegram', telegramRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Ready to serve...');
});

// Start server
app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});
