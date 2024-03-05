const express = require('express');
const util = require('util');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cityController = require('./cityController');
const userController = require('./userController');

const router = express.Router();

// Secret for JWT
const JWT_SECRET = 'OW-SECRET';

// Function to register user
async function registerUser(email, hashedPassword, name, unit, city_id, lang, db) {
    // Insert user into database
    const query = 'INSERT INTO users (email, password, name, city_id, unit, lang) VALUES (?, ?, ?, ?, ?, ?)';
    const queryPromise = util.promisify(db.query).bind(db);
    try {
        await queryPromise(query, [email, hashedPassword, name, city_id, unit, lang]);
        return lang === 'pt' ? 'Utilizador registado com sucesso!' : 'User registered successfully!';
    } catch (error) {
        return Promise.reject(lang === 'pt' ? 'Erro ao registar utilizador!' : 'Error registering user!');
    }
}

// Login route
router.post('/login', async (req, res) => {
    const lang = req.query.lang || 'en';
    try {
        const { email, password } = req.body;
        // Check if email and password are not null
        if (!email || !password) {
            return res.status(400).json({
                message:
                    lang === 'pt' ? 'E-mail e palavra-passe são obrigatórios!' : 'Email and password are required!',
            });
        }
        // Get user from database
        const user = await userController.checkUser(email, lang, req.db);
        // Check if user exists and password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res
                .status(401)
                .json({ message: lang === 'pt' ? 'E-mail ou palavra-passe inválidos!' : 'Invalid email or password!' });
        }
        // Create token
        const accessToken = jwt.sign({ email: user.email }, JWT_SECRET);
        // Get user from database
        const userObject = await userController.checkDatabase(email, lang, req.db);
        res.json({ accessToken, user: userObject.user });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
});

// Register route
router.post('/register', async (req, res) => {
    const lang = req.query.lang || 'en';
    try {
        const { email, password, name, unit } = req.body;
        const cityCode = req.body.city_code;
        // Check if email, password and name are not null
        if (!email || !password || !name) {
            return res.status(400).json({
                message:
                    lang === 'pt'
                        ? 'E-mail, palavra-passe e nome são obrigatórios!'
                        : 'Email, password and name are required!',
            });
        }
        // Check if user already exists
        const user = await userController.checkUser(email, lang, req.db);
        if (user) {
            return res.status(400).json({
                message: lang === 'pt' ? 'Este e-mail já está registado!' : 'This email is already registered!',
            });
        }
        // Validate password
        if (password.length < 6) {
            return res.status(400).json({
                message:
                    lang === 'pt'
                        ? 'Palavra-passe deve ter no mínimo 6 caracteres!'
                        : 'Password must have at least 6 characters!',
            });
        }
        // Validate city
        const cityId = await cityController.validateCityCode(cityCode, lang, req.db);
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Register user
        const message = await registerUser(email, hashedPassword, name, unit, cityId, lang, req.db);
        res.json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
});

module.exports = router;
