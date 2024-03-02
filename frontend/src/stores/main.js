import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMainStore = defineStore('main', () => {
    // Website theme
    const darkMode = ref(false);

    function toggleTheme() {
        // Toggle theme
        this.darkMode = !this.darkMode;

        // Save theme to local storage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('darkMode', darkMode.value);
        }
    }

    return {
        darkMode,
        toggleTheme,
    };
});
