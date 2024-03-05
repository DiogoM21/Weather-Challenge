import { defineStore } from 'pinia';
import { useToast } from 'vue-toast-notification';
import { useMainStore } from './mainStore';
import { useWeatherStore } from './weatherStore';
import { ref } from 'vue';
import axios from 'axios';

const router = require('@/router').default;

const mainStore = useMainStore();
const weatherStore = useWeatherStore();

const $toast = useToast();

// Back-End API URL
const BACKENDURL = 'http://localhost:3000';

export const useAuthStore = defineStore('authStore', () => {
    // Is Authenticated
    const auth = ref(false);

    // JWT Token
    const token = ref(null);

    // User data
    const user = ref(null);

    // Login function
    async function login(email, password, lang) {
        try {
            // Check if email and password are not null
            if (!email || !password) {
                $toast.error(
                    lang === 'pt' ? 'E-mail e palavra-passe são obrigatórios!' : 'Email and password are required!',
                );
            }
            // Send login request to API
            const response = await axios.post(`${BACKENDURL}/auth/login?lang=${lang}`, {
                email: email,
                password: password,
            });
            // Check if login was successful
            if (response.data.accessToken) {
                // Save token to storage
                saveUserData(response.data);
                $toast.success(response.data.user.lang === 'pt' ? 'Login efetuado com sucesso!' : 'Login successful!');
                router.replace('/');
            } else {
                $toast.error(response.data.message);
            }
        } catch (error) {
            handleError(error, lang === 'pt' ? 'Login falhou.' : 'Login failed.');
        }
    }

    // Register function
    async function register(email, password, name, city_code, unit, lang) {
        try {
            // Check if email and password are not null
            if (!email || !password || !name) {
                $toast.error(
                    lang === 'pt'
                        ? 'E-mail, palavra-passe e nome são obrigatórios!'
                        : 'Email, password and name are required!',
                );
            }
            // Send register request to API
            const response = await axios.post(`${BACKENDURL}/auth/register?lang=${lang}`, {
                email,
                password,
                name,
                city_code,
                unit,
            });
            // Check if register was successful
            if (response.data.message && response.status === 200) {
                $toast.success(response.data.message);
                router.replace('/login');
            } else {
                $toast.error(response.data.message);
            }
        } catch (error) {
            handleError(error, lang === 'pt' ? 'Registo falhou.' : 'Register failed.');
        }
    }

    // Function to save data to storage
    function saveUserData(data) {
        token.value = data.accessToken;
        localStorage.setItem('OW-token', data.accessToken);
        localStorage.setItem('OW-user', JSON.stringify(data.user));
        auth.value = true;
    }

    // Function to restore token from storage
    function checkAuth() {
        // Restore token from storage
        const storageToken = localStorage.getItem('OW-token');
        if (storageToken) {
            auth.value = true;
            token.value = storageToken;
            // Restore user from storage
            const storageUser = localStorage.getItem('OW-user');
            if (storageUser) {
                user.value = JSON.parse(storageUser);
                mainStore.toggleLang(user.value.lang === 'pt' ? 'pt' : 'en');
                weatherStore.getAPIWeather(user.value.city_code, user.value.unit);
            }
        }
    }

    // Function to logout
    function logout() {
        // Remove data from storage
        localStorage.removeItem('OW-token');
        localStorage.removeItem('OW-user');
        auth.value = false;
        token.value = null;
        user.value = null;
    }

    // Handle error from API
    function handleError(error, msg) {
        try {
            $toast.error(msg + ' ' + error.response.data.message);
        } catch {
            $toast.error(msg + ' ' + error);
        }
    }

    return {
        auth,
        token,
        login,
        register,
        checkAuth,
        logout,
    };
});
