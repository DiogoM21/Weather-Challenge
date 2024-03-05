const util = require('util');
const express = require('express');
const weatherController = require('./weatherController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Function to get user from database
async function checkDatabase(email, lang, db) {
    try {
        // Get user from database
        const query = `SELECT users.*, cities.code AS city_code FROM users 
        LEFT JOIN cities ON users.city_id = cities.id WHERE users.email = ?`;
        const queryPromise = util.promisify(db.query).bind(db);
        const results = await queryPromise(query, [email]);
        if (results.length > 0) {
            // User object
            return {
                user: {
                    id: results[0].id,
                    email: results[0].email,
                    name: results[0].name,
                    city_code: results[0].city_code,
                    unit: results[0].unit,
                    lang: results[0].lang,
                    created_at: weatherController.formatDateTime(results[0].created_at, lang),
                },
            };
        } else {
            return Promise.reject(lang === 'pt' ? 'Utilizador não encontrado!' : 'User not found!');
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

// Route to get user data
router.get('/', authMiddleware, async (req, res) => {
    const lang = req.query.lang || 'en';
    try {
        const { email } = req.body;
        // Get user from database
        const user = await checkDatabase(email, lang, req.db);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
});

module.exports = {
    checkDatabase,
    router,
};
