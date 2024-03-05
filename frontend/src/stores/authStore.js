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
            if (response.status === 200 && response.data.accessToken && response.data.user) {
                // Save token to storage
                saveUserData(response.data, true);
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
                    mainStore.lang === 'pt'
                        ? 'E-mail, palavra-passe e nome são obrigatórios!'
                        : 'Email, password and name are required!',
                );
            }
            // Send register request to API
            const response = await axios.post(`${BACKENDURL}/auth/register?lang=${mainStore.lang}`, {
                email,
                password,
                name,
                city_code,
                unit,
                lang,
            });
            // Check if register was successful
            if (response.status === 200) {
                $toast.success(response.data.message);
                router.replace('/login');
            } else {
                $toast.error(response.data.message);
            }
        } catch (error) {
            handleError(error, mainStore.lang === 'pt' ? 'Registo falhou.' : 'Register failed.');
        }
    }

    // Function to update user data
    async function updateUser(email, password, name, city_code, unit, lang) {
        try {
            // Send update request to API
            const response = await axios.patch(
                `${BACKENDURL}/user/update?lang=${mainStore.lang}`,
                {
                    email,
                    password,
                    name,
                    city_code,
                    unit,
                    lang,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                    },
                },
            );
            // Check if update was successful
            if (response.status === 200 && response.data.user) {
                $toast.success(response.data.message);
                saveUserData(response.data, false);
            } else {
                $toast.error(response.data.message);
            }
        } catch (error) {
            handleError(error, mainStore.lang === 'pt' ? 'Atualização falhou.' : 'Update failed.');
        }
    }

    // Function to delete user
    async function deleteUser() {
        try {
            // Send delete request to API
            const response = await axios.delete(`${BACKENDURL}/user/delete?lang=${mainStore.lang}`, {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
                data: {
                    email: user.value.email,
                },
            });
            // Check if delete was successful
            if (response.status === 200) {
                $toast.success(response.data.message);
                logout();
                router.replace('/login');
            } else {
                $toast.error(response.data.message);
            }
        } catch (error) {
            handleError(error, mainStore.lang === 'pt' ? 'Remoção falhou.' : 'Delete failed.');
        }
    }

    // Function to save data to storage
    function saveUserData(data, isLogin) {
        if (isLogin) {
            localStorage.setItem('OW-token', data.accessToken);
        }
        localStorage.setItem('OW-user', JSON.stringify(data.user));
    }

    // Function to restore token from storage
    function checkAuth() {
        try {
            // Restore token from storage
            const storageToken = localStorage.getItem('OW-token') || null;
            if (storageToken) {
                auth.value = true;
                token.value = storageToken;
                // Restore user from storage
                const storageUser = localStorage.getItem('OW-user') || null;
                if (storageUser) {
                    user.value = JSON.parse(storageUser);
                    mainStore.toggleLang(user.value.lang === 'pt' ? 'pt' : 'en');
                    if (user.value.city_code) {
                        weatherStore.getAPIWeather(user.value.city_code, user.value.unit, false);
                    }
                }
            }
        } catch (error) {
            $toast.error(mainStore.lang === 'pt' ? 'Erro ao restaurar sessão.' : 'Error restoring session.');
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
        user,
        login,
        register,
        updateUser,
        deleteUser,
        checkAuth,
        logout,
    };
});
