import { defineStore } from 'pinia';
import axios from 'axios';

const backendUrl = 'http://localhost:3000';

export const useWeatherStore = defineStore('weather', () => {
    async function getCurrentWeather(cityId) {
        try {
            const apiResponse = await axios.get(`${backendUrl}/cities/${cityId}/current`);
            return apiResponse.data.main.temp;
        } catch (error) {
            console.error(`Error fetching data from Back-End API: `, error);
        }
    }

    return {
        getCurrentWeather,
    };
});
