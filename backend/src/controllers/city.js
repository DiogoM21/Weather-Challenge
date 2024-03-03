const express = require('express');
const router = express.Router();
const weatherController = require('./weather');

// Cities
const cities = [
    { name: 'Lisboa', id: 2267056 },
    { name: 'Leira', id: 2267094 },
    { name: 'Coimbra', id: 2740636 },
    { name: 'Porto', id: 2735941 },
    { name: 'Faro', id: 2268337 },
];

// Method to validate cityId
const validateCityId = (cityId) => {
    if (isNaN(cityId)) {
        return { error: 'Invalid city ID. Must be a number!' };
    }
    if (!cities.find((city) => city.id === parseInt(cityId))) {
        return {
            error: 'Invalid city ID. Must be a valid city ID!',
            valid: cities.map((city) => city),
        };
    }
    return null;
};

// Cities route
router.get('/', (req, res) => {
    res.json({
        cities: cities.map((city) => ({ name: city.name, id: city.id })),
        count: cities.length,
    });
});

// Current weather route
router.get('/:id/current', (req, res) => {
    const cityId = req.params.id;
    const unit = req.query.unit || 'metric';
    const lang = req.query.lang || 'en';
    const force = req.query.force || false;

    // Validate cityId
    const invalid = validateCityId(cityId);
    if (invalid) {
        return res.status(400).json(invalid);
    }

    if (!force) {
        // Check if city is already in storage
        const storage = weatherController.checkStorage(cityId, unit, lang);
        if (storage) {
            return res.json(storage);
        }
    }

    return weatherController.getCurrentWeather(cityId, unit, lang, res);
});

module.exports = router;
