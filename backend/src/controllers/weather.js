const axios = require('axios');

// Import environment variables
const weatherApiName = 'OpenWeather';
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5';
const weatherApiKey = '519af113678c353b1ae6ef8ce8c10803';

// Check if city is already in storage
function checkStorage(cityId, unit, lang) {
    // TODO: Check if city is already in storage
    return false;
}

// Current weather method
async function getCurrentWeather(cityId, unit, lang, res) {
    try {
        const externalApiResponse = await axios.get(
            `${weatherApiUrl}/weather?id=${cityId}&appid=${weatherApiKey}&units=${unit}&lang=${lang}`,
        );
        const weather = res.json({
            values: {
                temp: externalApiResponse.data.main.temp,
                humidity: externalApiResponse.data.main.humidity,
                wind: externalApiResponse.data.wind.speed,
                deg: externalApiResponse.data.wind.deg,
            },
            info: {
                city: externalApiResponse.data.name,
                description:
                    externalApiResponse.data.weather[0].description.charAt(0).toUpperCase() +
                    externalApiResponse.data.weather[0].description.slice(1),
                icon: externalApiResponse.data.weather[0].icon,
                dt: externalApiResponse.data.dt,
                dateTime: new Intl.DateTimeFormat(lang === 'pt' ? 'pt-PT' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }).format(new Date(externalApiResponse.data.dt * 1000)),
            },
        });

        // Save data to storage
        // TODO: Save data to storage

        return weather;
    } catch (error) {
        console.error(`Error fetching data from ${weatherApiName} API:`, error);
        return res.status(500).json({ error: `Error fetching data ${weatherApiName} API.` });
    }
}

module.exports = {
    checkStorage,
    getCurrentWeather,
};
