import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useMainStore } from '@/stores/main.js';

import App from './App.vue';
import router from './router';

import './style.css';

// Init pinia
const pinia = createPinia();

// Create vue app
createApp(App).use(router).use(pinia).mount('#app');

// Use main store
const mainStore = useMainStore(pinia);

// Set theme from local storage or system preference
if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem('OW-darkMode') === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        mainStore.darkMode = true;
    } else {
        mainStore.darkMode = localStorage.getItem('OW-darkMode') === 'true';
    }
}

// Set language from local storage or system preference
console.log(navigator.language);
if (typeof localStorage !== 'undefined') {
    mainStore.lang = localStorage.getItem('OW-lang') || (navigator.language === 'pt-PT' ? 'pt' : 'en');
}

// Set default document title
const defaultDocumentTitle = 'Open Weather';

// Set document title on route change
router.afterEach((to) => {
    switch (mainStore.lang) {
        case 'pt':
            document.title = to.meta?.titlePT ? `${to.meta.titlePT} - ${defaultDocumentTitle}` : defaultDocumentTitle;
            break;
        default:
            document.title = to.meta?.title ? `${to.meta.title} - ${defaultDocumentTitle}` : defaultDocumentTitle;
    }
});

// Force document title on language change
function forceDocumentTitle() {
    switch (mainStore.lang) {
        case 'pt':
            document.title = document.title.replace(
                router.currentRoute.value.meta.title,
                router.currentRoute.value.meta.titlePT,
            );
            break;
        default:
            document.title = document.title.replace(
                router.currentRoute.value.meta.titlePT,
                router.currentRoute.value.meta.title,
            );
    }
}

export { forceDocumentTitle };
