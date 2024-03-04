import { defineStore } from 'pinia';
import { useToast } from 'vue-toast-notification';
import { useMainStore } from '@/stores/main';
import axios from 'axios';
import { ref } from 'vue';

const $toast = useToast();

// Back-End API URL
const backendUrl = 'http://localhost:3000';

const mainStore = useMainStore();

export const useWeatherStore = defineStore('weather', () => {
    // Selected values
    const selectedCity = ref(null);
    const selectedUnit = ref('metric');

    // Check if city is already in storage
    function checkStorage() {
        // Get storage
        const storage = JSON.parse(localStorage.getItem('OW-weather')) || {};
        const key = `${selectedCity.value}-${selectedUnit.value}-${mainStore.lang}`;
        const storedWeather = storage[key];

        // If data is in storage, return it
        if (storedWeather) {
            try {
                const now = new Date().getTime();
                const diff = now - storedWeather.info.dt * 1000;

                // If data is not older than 30 minute, return it
                if (diff < 1800000) {
                    return storedWeather;
                }
            } catch (error) {
                switch (mainStore.lang) {
                    case 'pt':
                        $toast.error('Erro ao carregar tempo da memória.');
                        break;
                    default:
                        $toast.error('Error loading weather from memory.');
                }
            }
        }

        return false;
    }

    // Save data to storage
    function storeWeather(data) {
        // Get storage
        const storage = JSON.parse(localStorage.getItem('OW-weather')) || {};
        const key = `${selectedCity.value}-${selectedUnit.value}-${mainStore.lang}`;

        // Save data to storage
        storage[key] = data;
        localStorage.setItem('OW-weather', JSON.stringify(storage));
    }

    // Get current weather form city
    async function getCurrentWeather(cityId, unit, force) {
        selectedCity.value = cityId;
        selectedUnit.value = unit;

        if (!force) {
            // Check if weather is already in storage
            const storage = checkStorage();
            if (storage) {
                return storage;
            }
        }

        try {
            // Get data from API and save it to storage
            const apiResponse = await axios.get(
                `${backendUrl}/cities/${selectedCity.value}/current?unit=${selectedUnit.value}&lang=${mainStore.lang}&force=${force}`,
            );
            if (apiResponse.data.values) {
                storeWeather(apiResponse.data);
            }

            return apiResponse.data;
        } catch (error) {
            handleError(error);
        }
    }

    // Handle error from API
    function handleError(error) {
        let errorMsg;
        switch (mainStore.lang) {
            case 'pt':
                errorMsg = 'Erro ao carregar dados da API Back-End.';
                break;
            default:
                errorMsg = 'Error loading Back-End API data.';
        }
        try {
            // Back-End API error
            if (error.response.status === 400) {
                $toast.error(errorMsg + ' ' + error.response.data.message);
            } else {
                // Open Weather API error
                switch (mainStore.lang) {
                    case 'pt':
                        errorMsg = 'Erro ao carregar dados da API Open Weather.';
                        break;
                    default:
                        errorMsg = 'Error loading Open Weather API data.';
                }
                $toast.error(errorMsg);
            }
        } catch {
            $toast.error(errorMsg + ' ' + error);
        }
    }

    return {
        selectedCity,
        selectedUnit,
        getCurrentWeather,
    };
});
