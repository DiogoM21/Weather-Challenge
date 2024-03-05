const util = require('util');
const express = require('express');
const bcrypt = require('bcryptjs');
const weatherController = require('./weatherController');
const cityController = require('./cityController');
const authenticateToken = require('../middlewares/authMiddleware');

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

// Function to check user
async function checkUser(email, lang, db) {
    try {
        // Get user from database
        const query = 'SELECT * FROM users WHERE email = ?';
        const queryPromise = util.promisify(db.query).bind(db);
        const results = await queryPromise(query, [email]);
        return results[0];
    } catch (error) {
        return Promise.reject(lang === 'pt' ? 'Erro ao verificar utilizador!' : 'Error checking user!');
    }
}

// Route to get user data from database
router.get('/', authenticateToken, async (req, res) => {
    try {
        const lang = req.query.lang || 'en';
        const { email } = req.body;
        // Get user from database
        return res.json(await checkDatabase(email, lang, req.db));
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
});

// Function to update user
async function updateUser(email, hashedPassword, name, unit, city_id, lang, db) {
    try {
        // Update user in database
        const query = 'UPDATE users SET password = ?, name = ?, city_id = ?, unit = ?, lang = ? WHERE email = ?';
        const queryPromise = util.promisify(db.query).bind(db);
        await queryPromise(query, [hashedPassword, name, city_id, unit, lang, email]);
        return Promise.resolve(lang === 'pt' ? 'Utilizador atualizado com sucesso!' : 'User updated successfully!');
    } catch (error) {
        return Promise.reject(lang === 'pt' ? 'Erro ao atualizar utilizador!' : 'Error updating user!');
    }
}

// Route to update user data in database
router.patch('/update', authenticateToken, async (req, res) => {
    try {
        const lang = req.query.lang || 'en';
        const { email, password, name, unit } = req.body;
        const bodyLang = req.body.lang || 'en';
        const cityCode = req.body.city_code;
        // Check if email and name are not null
        if (!email || !name) {
            return res.status(400).json({
                message: lang === 'pt' ? 'E-mail e nome são obrigatórios!' : 'Email and name are required!',
            });
        }
        // Check if user exists
        const user = await checkUser(email, lang, req.db);
        if (!user) {
            return res.status(400).json({
                message: lang === 'pt' ? 'Utilizador não encontrado!' : 'User not found!',
            });
        }

        // Validate city
        const cityId = await cityController.validateCityCode(cityCode, lang, req.db);
        // Hash password if provided
        const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;
        // Update user
        await updateUser(email, hashedPassword, name, unit, cityId, bodyLang, req.db);
        // Get updated user from database
        const updatedUser = await checkDatabase(email, lang, req.db);
        res.json({
            message: lang === 'pt' ? 'Utilizador atualizado com sucesso!' : 'User updated successfully!',
            user: updatedUser.user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
});

// Route to delete user from database
router.delete('/delete', authenticateToken, async (req, res) => {
    try {
        const lang = req.query.lang || 'en';
        const { email } = req.body;
        // Check if email is not null
        if (!email) {
            return res.status(400).json({
                message: lang === 'pt' ? 'E-mail é obrigatório!' : 'Email is required!',
            });
        }
        // Check if user exists
        const user = await checkUser(email, lang, req.db);
        if (!user) {
            return res.status(400).json({
                message: lang === 'pt' ? 'Utilizador não encontrado!' : 'User not found!',
            });
        }
        // Delete user from database
        const query = 'DELETE FROM users WHERE email = ?';
        const queryPromise = util.promisify(req.db.query).bind(req.db);
        await queryPromise(query, [email]);
        res.json({ message: lang === 'pt' ? 'Utilizador eliminado com sucesso!' : 'User deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
});

module.exports = {
    checkDatabase,
    checkUser,
    router,
};
