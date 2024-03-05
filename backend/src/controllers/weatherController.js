const axios = require('axios');
const util = require('util');

// Weather API URL and Key
const WEATHERAPIURL = 'https://api.openweathermap.org/data/2.5';
const WEATHERAPIKEY = '519af113678c353b1ae6ef8ce8c10803';

// Function to format date and time
function formatDateTime(dt, lang) {
    try {
        return new Intl.DateTimeFormat(lang === 'pt' ? 'pt-PT' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date(dt));
    } catch (error) {
        return Promise.reject(lang === 'pt' ? 'Erro ao formatar data e hora!' : 'Error formatting date and time!');
    }
}

// Function to check weather data in database
async function checkDatabase(cityCode, unit, lang, db) {
    try {
        // Get weather data from database
        const query = `SELECT * FROM weather 
        JOIN cities ON weather.city_id = cities.id JOIN weather_next ON weather.id = weather_next.weather_id
        WHERE cities.code = ? AND weather.unit = ? AND weather.lang = ? AND weather.created_at > DATE_SUB(NOW(), INTERVAL 30 MINUTE)`;
        const queryPromise = util.promisify(db.query).bind(db);
        const results = await queryPromise(query, [cityCode, unit, lang]);

        if (results.length > 0) {
            // Weather object
            return {
                values: {
                    temp: results[0].temp,
                    feels_like: results[0].feels_like,
                    humidity: results[0].humidity,
                    wind: results[0].wind,
                    deg: results[0].deg,
                },
                info: {
                    name: results[0].name,
                    description: results[0].description,
                    icon: results[0].icon,
                    dt: results[0].dt,
                    date_time: formatDateTime(results[0].created_at, lang),
                },
                next: results.map((item) => {
                    return {
                        values: {
                            temp: item.temp,
                            feels_like: item.feels_like,
                            humidity: item.humidity,
                            wind: item.wind,
                            deg: item.deg,
                        },
                        info: {
                            description: item.description,
                            icon: item.icon,
                            dt: item.dt,
                            date_time: formatDateTime(item.date_time, lang),
                        },
                    };
                }),
            };
        } else {
            return false;
        }
    } catch (error) {
        return Promise.reject(lang === 'pt' ? 'Erro ao carregar dados do tempo!' : 'Error loading weather data!');
    }
}

// Function to fetch weather data from external API
async function fetchAPIWeatherData(endpoint, lang) {
    try {
        return await axios.get(endpoint);
    } catch (error) {
        return Promise.reject(
            lang === 'pt' ? 'Erro ao carregar tempo da API Externa!' : 'Error loading weather from External API!',
        );
    }
}

// Function to delete old weather data from database
async function deleteOldWeatherData(cityCode, unit, lang, db) {
    try {
        // Delete old weather data
        const query = `DELETE weather FROM weather JOIN cities ON weather.city_id = cities.id WHERE cities.code = ? AND weather.unit = ? AND weather.lang = ?`;
        const queryPromise = util.promisify(db.query).bind(db);
        await queryPromise(query, [cityCode, unit, lang]);
    } catch (error) {
        console.error(
            lang === 'pt' ? 'Erro ao apagar dados antigos do tempo!' : 'Error deleting old weather data!',
            error,
        );
    }
}

// Function to save weather data to database
async function saveWeatherData(cityCode, unit, lang, weather, db) {
    try {
        // Get city id
        const query = 'SELECT id FROM cities WHERE code = ?';
        const queryPromise = util.promisify(db.query).bind(db);
        const cityResults = await queryPromise(query, [cityCode]);
        const cityId = cityResults[0].id;

        // Save current weather data and get the inserted id
        const insertQuery = `INSERT INTO weather 
        (city_id, unit, lang, temp, feels_like, humidity, wind, deg, description, icon, dt) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const insertPromise = util.promisify(db.query).bind(db);
        const result = await insertPromise(insertQuery, [
            cityId,
            unit,
            lang,
            weather.values.temp,
            weather.values.feels_like,
            weather.values.humidity,
            weather.values.wind,
            weather.values.deg,
            weather.info.description,
            weather.info.icon,
            weather.info.dt,
        ]);
        // Get the inserted id
        const weatherId = result.insertId;

        // Save next weather data
        const insertNextQuery =
            'INSERT INTO weather_next (weather_id, temp, feels_like, humidity, wind, deg, description, icon, dt, date_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const insertNextPromise = util.promisify(db.query).bind(db);
        for (const item of weather.next) {
            await insertNextPromise(insertNextQuery, [
                weatherId,
                item.values.temp,
                item.values.feels_like,
                item.values.humidity,
                item.values.wind,
                item.values.deg,
                item.info.description,
                item.info.icon,
                item.info.dt,
                new Date(item.info.dt * 1000).toISOString().replace('T', ' ').substring(0, 19),
            ]);
        }
    } catch (error) {
        console.error(lang === 'pt' ? 'Erro ao salvar dados do tempo!' : 'Error saving weather data!', error);
    }
}

// Function to get weather data from external API
async function getAPIWeather(cityCode, unit, lang, res, db) {
    try {
        // Get weather data from external API
        const currentRes = await fetchAPIWeatherData(
            `${WEATHERAPIURL}/weather?id=${cityCode}&appid=${WEATHERAPIKEY}&units=${unit}&lang=${lang}`,
            lang,
        );
        const nextRes = await fetchAPIWeatherData(
            `${WEATHERAPIURL}/forecast?id=${cityCode}&appid=${WEATHERAPIKEY}&units=${unit}&lang=${lang}&cnt=10`,
            lang,
        );

        if (currentRes.data && nextRes.data) {
            // Weather object
            const weather = {
                values: {
                    temp: currentRes.data.main.temp,
                    feels_like: currentRes.data.main.feels_like,
                    humidity: currentRes.data.main.humidity,
                    wind: currentRes.data.wind.speed,
                    deg: currentRes.data.wind.deg,
                },
                info: {
                    name: currentRes.data.name,
                    description:
                        currentRes.data.weather[0].description.charAt(0).toUpperCase() +
                        currentRes.data.weather[0].description.slice(1),
                    icon: currentRes.data.weather[0].icon,
                    dt: currentRes.data.dt,
                    date_time: formatDateTime(currentRes.data.dt * 1000, lang),
                },
                next: nextRes.data.list.map((item) => {
                    return {
                        values: {
                            temp: item.main.temp,
                            feels_like: item.main.feels_like,
                            humidity: item.main.humidity,
                            wind: item.wind.speed,
                            deg: item.wind.deg,
                        },
                        info: {
                            description:
                                item.weather[0].description.charAt(0).toUpperCase() +
                                item.weather[0].description.slice(1),
                            icon: item.weather[0].icon,
                            dt: item.dt,
                            date_time: formatDateTime(item.dt * 1000, lang),
                        },
                    };
                }),
            };

            // Delete old data from database
            await deleteOldWeatherData(cityCode, unit, lang, db);
            // Save data to database
            await saveWeatherData(cityCode, unit, lang, weather, db);
            return res.json(weather);
        } else {
            res.status(500).json({
                message: lang === 'pt' ? 'Erro ao carregar dados do tempo!' : 'Error loading weather data!',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
}

module.exports = {
    checkDatabase,
    getAPIWeather,
    formatDateTime,
};
