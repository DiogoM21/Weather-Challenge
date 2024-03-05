import { defineStore } from 'pinia';
import { useToast } from 'vue-toast-notification';
import { useMainStore } from '@/stores/main';
import { ref } from 'vue';
import axios from 'axios';

const $toast = useToast();

const mainStore = useMainStore();

// Back-End API URL
const BACKENDURL = 'http://localhost:3000';

export const useAuthStore = defineStore('auth', () => {
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
            handleError(error);
        }
    }

    // Register function
    async function register(email, password, name, unit, lang) {
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
                unit,
            });
            // Check if register was successful
            if (response.data.message) {
                $toast.success(response.data.message);
                return true;
            } else {
                $toast.error(response.data.message);
            }
        } catch (error) {
            handleError(error);
        }
    }

    // Handle error from API
    function handleError(error) {
        let errorMsg = mainStore.lang === 'pt' ? 'Login falhou.' : 'Login failed.';
        try {
            $toast.error(errorMsg + ' ' + error.response.data.message);
        } catch {
            $toast.error(errorMsg + ' ' + error);
        }
    }

    return {
        auth,
        token,
        login,
        register,
    };
});
