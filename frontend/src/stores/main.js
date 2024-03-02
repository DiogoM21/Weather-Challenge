import { defineStore } from 'pinia';
import { ref } from 'vue';
import { forceDocumentTitle } from '@/main.js';

export const useMainStore = defineStore('main', () => {
    // Website theme
    const darkMode = ref(true);

    // Website language
    const lang = ref('pt');

    // Toggle theme
    function toggleTheme() {
        this.darkMode = !this.darkMode;

        // Save theme to local storage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('OW-darkMode', darkMode.value);
        }
    }

    // Toggle language
    function toggleLang() {
        this.lang = this.lang === 'pt' ? 'en' : 'pt';

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
