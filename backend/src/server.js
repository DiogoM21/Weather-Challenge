const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();

// Port
const port = 3000;

// MySQL Connection
const db = mysql.createConnection({
    host: 'db',
    user: 'admin',
    password: 'root',
    database: 'glartek-challenge',
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database.');
    }
});

// Make db accessible to our router
app.use((req, res, next) => {
    req.db = db;
    next();
});

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
