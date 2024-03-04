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

    // Check if weather is already in storage
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
                return mainStore.lang === 'pt'
                    ? $toast.error('Erro ao carregar tempo da memória.')
                    : $toast.error('Error loading weather from memory.');
            }
        }
        return false;
    }

    // Save data to storage
    function storeWeather(data) {
        // Get storage
        const storage = JSON.parse(localStorage.getItem('OW-weather')) || {};
        const key = `${selectedCity.value}-${selectedUnit.value}-${mainStore.lang}`;
        storage[key] = data;

        // Save data to storage
        localStorage.setItem('OW-weather', JSON.stringify(storage));
    }

    // Get weather from API
    async function getAPIWeather(cityId, unit, force) {
        selectedCity.value = cityId;
        selectedUnit.value = unit;
        if (!force) {
            // Check if weather is already in storage
            const storage = checkStorage();
            if (storage) return storage;
        }
        try {
            // Get data from API and save it to storage
            const apiResponse = await axios.get(
                `${backendUrl}/cities/${selectedCity.value}/weather?unit=${selectedUnit.value}&lang=${mainStore.lang}&force=${force}`,
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
        let errorMsg = mainStore.lang === 'pt' ? 'Erro ao carregar dados da API.' : 'Error loading Back-End API.';
        try {
            $toast.error(errorMsg + ' ' + error.response.data.message);
        } catch {
            $toast.error(errorMsg + ' ' + error);
        }
    }

    return {
        selectedCity,
        selectedUnit,
        getAPIWeather,
    };
});
