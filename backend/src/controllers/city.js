const express = require('express');
const router = express.Router();
const weatherController = require('./weather');

// Method to get cities from database
function getCities(lang, db, callback) {
    const query = 'SELECT * FROM cities';
    const cities = [];

    // Fetch cities from database
    db.query(query, (error, results) => {
        if (error) {
            switch (lang) {
                case 'pt':
                    callback({ message: 'Erro ao carregar cidades!' }, null);
                    break;
                default:
                    callback({ message: 'Error loading cities!' }, null);
            }
        } else {
            results.forEach((city) => {
                cities.push(city);
            });
            callback(null, cities);
        }
    });
}

// Method to validate cityCode
function validatecityCode(cityCode, lang, db, callback) {
    // Check if cityCode is a number
    if (isNaN(cityCode)) {
        let message;
        switch (lang) {
            case 'pt':
                message = 'Código de cidade deve ser um número!';
                break;
            default:
                message = 'City code must be a number!';
        }
        callback({ message });
    } else {
        // Get cities from database
        getCities(lang, db, (error, cities) => {
            if (error) {
                callback(error);
            } else {
                // Check if cityCode is valid
                if (!cities.find((city) => city.code === parseInt(cityCode))) {
                    let message;
                    switch (lang) {
                        case 'pt':
                            message = 'Código de cidade não é válido!';
                            break;
                        default:
                            message = 'City code is not valid!';
                    }
                    callback({ message });
                }
                callback(null, cities);
            }
        });
    }
}

// Cities from database route
router.get('/', (req, res) => {
    const lang = req.query.lang || 'en';
    getCities(lang, req.db, (error, cities) => {
        if (error) {
            console.error(error.message);
            res.status(500).send(error);
        } else {
            res.json({
                cities: cities.map((city) => {
                    return {
                        label: city.name,
                        value: city.code,
                    };
                }),
            });
        }
    });
});

// Current weather route
router.get('/:id/current', (req, res) => {
    const cityCode = req.params.id;
    const unit = req.query.unit || 'metric';
    const lang = req.query.lang || 'en';
    const force = req.query.force || false;

    // Validate cityCode
    validatecityCode(cityCode, lang, req.db, (error) => {
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        if (!force) {
            // Check if city is already in database
            weatherController.checkDatabase(cityCode, unit, lang, req.db, (err, weather) => {
                if (err) {
                    console.error(err.message);
                } else if (weather) {
                    return res.json(weather);
                } else {
                    return weatherController.getWeather(cityCode, unit, lang, res, req.db);
                }
            });
        } else {
            return weatherController.getWeather(cityCode, unit, lang, res, req.db);
        }
    });
});

module.exports = router;
