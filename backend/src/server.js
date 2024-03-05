const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();

// Port
const PORT = 3000;

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
    app.use(express.json());
    app.use(cors());

    // Controllers
    const homeController = require('./controllers/homeController');
    const authController = require('./controllers/authController');
    const { router: cityController } = require('./controllers/cityController');
    const { router: userController } = require('./controllers/userController');

    // Routes
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/cities', cityController);
    app.use('/user', userController);

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is listening at http://localhost:${PORT}`);
    });
});
