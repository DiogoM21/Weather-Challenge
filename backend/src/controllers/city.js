const express = require('express');
const util = require('util');
const router = express.Router();
const weatherController = require('./weather');

// Function to get cities from database
async function getCities(lang, db) {
    // Get cities from database
    const query = 'SELECT * FROM cities';
    const queryPromise = util.promisify(db.query).bind(db);
    try {
        const results = await queryPromise(query);
        return results;
    } catch (error) {
        return Promise.reject(lang === 'pt' ? 'Erro ao carregar cidades!' : 'Error loading cities!');
    }
}

// Function to validate cityCode
async function validatecityCode(cityCode, lang, db) {
    // Check if cityCode is a number
    if (isNaN(cityCode)) {
        return Promise.reject(lang === 'pt' ? 'Código de cidade deve ser um número!' : 'City code must be a number!');
    } else {
        try {
            // Get cities from database
            const cities = await getCities(lang, db);
            // Check if cityCode is valid
            if (!cities.find((city) => city.code === parseInt(cityCode))) {
                return Promise.reject(lang === 'pt' ? 'Código de cidade não é válido!' : 'City code is not valid!');
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

// Cities route
router.get('/', async (req, res) => {
    const lang = req.query.lang || 'en';
    try {
        // Get cities from database
        const cities = await getCities(lang, req.db);
        res.json({
            cities: cities.map((city) => {
                return {
                    label: city.name,
                    value: city.code,
                };
            }),
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
});

// Weather route
router.get('/:id/weather', async (req, res) => {
    // Params and query from request
    const cityCode = req.params.id;
    const unit = req.query.unit || 'metric';
    const lang = req.query.lang || 'en';
    const force = req.query.force || false;
    try {
        // Validate cityCode
        await validatecityCode(cityCode, lang, req.db);
        // Get weather from database
        if (!force) {
            // Check if weather is already in database
            const weather = await weatherController.checkDatabase(cityCode, unit, lang, req.db);
            if (weather) {
                return res.json(weather);
            }
        }
        // Get weather from External API
        return weatherController.getAPIWeather(cityCode, unit, lang, res, req.db);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error });
    }
});

module.exports = router;
