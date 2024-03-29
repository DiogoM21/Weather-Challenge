import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useToast } from 'vue-toast-notification';
import { useMainStore } from '@/stores/mainStore.js';
import axios from 'axios';

const $toast = useToast();

// Back-End API URL
const BACKENDURL = 'http://localhost:3000';

const mainStore = useMainStore();

export const useCityStore = defineStore('cityStore', () => {
    // City data
    const cities = ref(null);

    // Check if city is already in storage
    function checkStorage() {
        // Get storage
        const storage = JSON.parse(localStorage.getItem('OW-cities')) || {};
        const storedCities = storage['cities'];

        // If data is in storage, return it
        if (storedCities && storedCities.length > 0) {
            try {
                const now = new Date().getTime();
                const diff = now - storage['lastUpdate'];
                // If data is not older than 1 hour, return it
                if (diff < 3600000) {
                    return storedCities;
                }
            } catch (error) {
                return mainStore.lang === 'pt'
                    ? $toast.error('Erro ao carregar cidades da memória.')
                    : $toast.error('Error loading cidades from memory.');
            }
        }
        return false;
    }

    // Save data to storage
    function storeCities(data) {
        // Get storage
        const storage = JSON.parse(localStorage.getItem('OW-cities')) || {};
        const now = new Date().getTime();
        storage['cities'] = data;
        storage['lastUpdate'] = now;

        // Save data to storage
        localStorage.setItem('OW-cities', JSON.stringify(storage));
    }

    // Get cities from API
    async function getAPICities(force) {
        try {
            if (!force) {
                // Check if city is already in storage
                const storage = checkStorage();
                if (storage) {
                    cities.value = storage;
                    return;
                }
            }
            // Get data from API and save it to storage
            const apiResponse = await axios.get(`${BACKENDURL}/cities?lang=${mainStore.lang}`);
            if (apiResponse.data.cities && apiResponse.data.cities.length > 0) {
                storeCities(apiResponse.data.cities);
            }
            cities.value = apiResponse.data.cities;
        } catch (error) {
            handleError(error);
        }
    }

    // Handle error from API
    function handleError(error) {
        let errorMsg = mainStore.lang === 'pt' ? 'Erro ao carregar dados da API.' : 'Error loading API data.';
        try {
            $toast.error(errorMsg + ' ' + error.response.data.message);
        } catch {
            $toast.error(errorMsg + ' ' + error);
        }
    }

    return {
        cities,
        getAPICities,
    };
});
