import { defineStore } from 'pinia';
import { ref } from 'vue';
import { forceDocumentTitle } from '@/main.js';

export const useMainStore = defineStore('mainStore', () => {
    // Website theme
    const darkMode = ref(true);

    // Website language
    const lang = ref('pt');

    // Toggle theme
    function toggleTheme() {
        darkMode.value = !darkMode.value;

        // Save theme to local storage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('OW-darkMode', darkMode.value);
        }
    }

    // Toggle language
    function toggleLang() {
        lang.value = lang.value === 'pt' ? 'en' : 'pt';

        // Set document title on language change
        forceDocumentTitle();

        // Save language to local storage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('OW-lang', lang.value);
        }
    }

    return {
        darkMode,
        lang,
        toggleTheme,
        toggleLang,
    };
});
