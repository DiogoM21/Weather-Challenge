const axios = require('axios');

// Import environment variables
const weatherApiName = process.env.WEATHER_API_NAME;
const weatherApiUrl = process.env.WEATHER_API_URL;
const weatherApiKey = process.env.WEATHER_API_KEY;

// Current weather method
const getCurrentWeather = async (cityId, res) => {
    try {
        const externalApiResponse = await axios.get(`${weatherApiUrl}/weather?id=${cityId}&appid=${weatherApiKey}`);
        res.json(externalApiResponse.data);
    } catch (error) {
        console.error(`Error fetching data from ${weatherApiName} API: `, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getCurrentWeather,
};
