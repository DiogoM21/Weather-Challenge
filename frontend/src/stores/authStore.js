import { defineStore } from 'pinia';
import { useToast } from 'vue-toast-notification';
import { ref } from 'vue';
import axios from 'axios';

const $toast = useToast();

// Back-End API URL
const BACKENDURL = 'http://localhost:3000';

export const useAuthStore = defineStore('authStore', () => {
    // Is Authenticated
    const auth = ref(false);

    // JWT Token
    const token = ref(null);

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
                localStorage.setItem('OW-token', response.data.accessToken);
                token.value = response.data.accessToken;
                auth.value = true;
                $toast.success(lang === 'pt' ? 'Login efetuado com sucesso!' : 'Login successful!');
                return true;
            } else {
                $toast.error(response.data.message);
            }
        } catch (error) {
            handleError(error, lang === 'pt' ? 'Login falhou.' : 'Login failed.');
        }
    }

    // Register function
    async function register(email, password, name, city, unit, lang) {
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
                city,
                unit,
            });
            // Check if register was successful
            if (response.data.message && response.status === 200) {
                $toast.success(response.data.message);
                return true;
            } else {
                $toast.error(response.data.message);
            }
        } catch (error) {
            handleError(error, lang === 'pt' ? 'Registo falhou.' : 'Register failed.');
        }
    }

    // Function to restore token from storage
    function checkAuth() {
        const storageToken = localStorage.getItem('OW-token');
        if (storageToken) {
            token.value = storageToken;
            auth.value = true;
        }
    }

    // Function to logout
    function logout() {
        // Remove token from storage
        localStorage.removeItem('OW-token');
        token.value = null;
        auth.value = false;
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
