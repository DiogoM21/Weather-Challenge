const express = require('express');
const cors = require('cors');
const app = express();

// Environment variables
require('dotenv').config();

// Environment variables
const port = process.env.PORT;

// Middleware
app.use(cors());

// Controllers
const homeController = require('./controllers/home');
const cityController = require('./controllers/city');

// Routes
app.use('/', homeController);
app.use('/cities', cityController);

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
