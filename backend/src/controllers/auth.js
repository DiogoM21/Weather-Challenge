const express = require('express');
const util = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Function to check user
async function checkUser(lang, db) {
    // Get user from database
    const query = 'SELECT * FROM users WHERE email = ?';
    const queryPromise = util.promisify(db.query).bind(db);
    try {
        const results = await queryPromise(query);
        return results[0];
    } catch (error) {
        return Promise.reject(lang === 'pt' ? 'Erro ao verificar utilizador!' : 'Error checking user!');
    }
}

// Function to register user
async function registerUser(email, hashedPassword, name, unit, lang, db) {
    // Insert user into database
    const query = 'INSERT INTO users (email, password, name, unit, lang) VALUES (?, ?, ?, ?, ?)';
    const queryPromise = util.promisify(db.query).bind(db);
    try {
        await queryPromise(query, [email, hashedPassword, name, unit, lang]);
        return lang === 'pt' ? 'Utilizador registado com sucesso!' : 'User registered successfully!';
    } catch (error) {
        return Promise.reject(lang === 'pt' ? 'Erro ao registar utilizador!' : 'Error registering user!');
    }
}

// Login route
router.post('/login', async (req, res) => {
    const lang = req.query.lang || 'en';
    const { email, password } = req.body;
    try {
        // Check if email and password are not null
        if (!email || !password) {
            return res.status(400).json({
                message: lang === 'pt' ? 'E-mail e palavra-passe são obrigatórios' : 'Email and password are required',
            });
        }
        // Get user from database
        const user = await checkUser(lang, req.db);
        // Check if user exists and password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res
                .status(401)
                .json({ message: lang === 'pt' ? 'E-mail ou palavra-passe inválidos!' : 'Invalid email or password!' });
        }
        // Create token
        const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
        res.json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
});

// Register route
router.post('/register', async (req, res) => {
    const lang = req.query.lang || 'en';
    const { email, password, name, unit } = req.body;
    try {
        // Check if email and password are not null
        if (!email || !password) {
            return res.status(400).json({
                message: lang === 'pt' ? 'E-mail e palavra-passe são obrigatórios' : 'Email and password are required',
            });
        }
        // Check if user already exists
        const user = await checkUser(lang, req.db);
        if (user) {
            return res.status(400).json({
                message: lang === 'pt' ? 'Este e-mail já está registado!' : 'This email is already registered!',
            });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Register user
        const message = await registerUser(email, hashedPassword, name, unit, lang, req.db);
        res.json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
});

module.exports = router;
