const axios = require('axios');

// Import environment variables
const weatherApiName = process.env.WEATHER_API_NAME;
const weatherApiUrl = process.env.WEATHER_API_URL;
const weatherApiKey = process.env.WEATHER_API_KEY;

// Current weather method
async function getCurrentWeather(cityId, units, lang, res) {
    try {
        const externalApiResponse = await axios.get(
            `${weatherApiUrl}/weather?id=${cityId}&appid=${weatherApiKey}&units=${units}&lang=${lang}`,
        );
        return res.json({
            values: {
                temp: externalApiResponse.data.main.temp,
                humidity: externalApiResponse.data.main.humidity,
            },
            info: {
                description:
                    externalApiResponse.data.weather[0].description.charAt(0).toUpperCase() +
                    externalApiResponse.data.weather[0].description.slice(1),
                icon: externalApiResponse.data.weather[0].icon,
                dt: new Intl.DateTimeFormat(lang === 'pt' ? 'pt-PT' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }).format(new Date(externalApiResponse.data.dt * 1000)),
            },
        });
    } catch (error) {
        console.error(`Error fetching data from ${weatherApiName} API:`, error);
        return res.status(500).json({ error: `Error fetching data ${weatherApiName} API.` });
    }
}

module.exports = {
    getCurrentWeather,
};
