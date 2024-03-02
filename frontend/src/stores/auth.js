import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    // Authenticated
    const auth = ref(false);

    return {
        auth,
    };
});
