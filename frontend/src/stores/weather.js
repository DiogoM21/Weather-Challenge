import { defineStore } from 'pinia';
import { useMainStore } from './main';
import { useToast } from 'vue-toast-notification';
import axios from 'axios';
import { ref } from 'vue';

const mainStore = useMainStore();
const $toast = useToast();

// Back-End API URL
const backendUrl = 'http://localhost:3000';

// Weather units
const units = ref('metric');

// Current weather
const weather = ref(null);

export const useWeatherStore = defineStore('weather', () => {
    // Get current weather form city
    async function getCurrentWeather(cityId, units, lang) {
        $toast.clear();
        try {
            const apiResponse = await axios.get(`${backendUrl}/cities/${cityId}/current?units=${units}&lang=${lang}`);
            return (weather.value = apiResponse.data);
        } catch (error) {
            switch (mainStore.lang) {
                case 'pt':
                    console.error(`Erro ao carregar dados da API: `, error);
                    $toast.error('Erro ao carregar dados da API.');
                    break;
                default:
                    console.error('Error loading API data: ', error);
                    $toast.error('Error loading API data.');
            }
        }
    }

    return {
        units,
        getCurrentWeather,
    };
});
