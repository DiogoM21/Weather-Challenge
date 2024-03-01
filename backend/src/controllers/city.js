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
router.get('/:id/current', async (req, res) => {
    const cityId = req.params.id;

    // Validate cityId
    const validation = validateCityId(cityId);
    if (validation) {
        return res.status(400).json(validation);
    }

    return weatherController.getCurrentWeather(cityId, res);
});

module.exports = router;
