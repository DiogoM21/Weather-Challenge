const express = require('express');
const app = express();
require('dotenv').config();

// Environment variables
const port = process.env.PORT;

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
