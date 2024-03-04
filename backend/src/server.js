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

// Function to connect to database
async function connectWithRetry(db) {
    while (db.state !== 'disconnected') {
        try {
            await db.connect();
            console.log('Connected to database.');
            break;
        } catch (err) {
            console.error('Error connecting to database. Retrying in 5 seconds.');
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
}

// Connect to database
connectWithRetry(db).then(() => {
    // Make db accessible to our router
    app.use((req, res, next) => {
        req.db = db;
        next();
    });

    // Middleware
    app.use(cors());

    // Controllers
    const homeController = require('./controllers/home');
    const authController = require('./controllers/auth');
    const cityController = require('./controllers/city');

    // Routes
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/cities', cityController);

    // Start the server
    app.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
    });
});
