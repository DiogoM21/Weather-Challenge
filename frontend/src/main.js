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

// Set default document title
const defaultDocumentTitle = 'Weather ';

// Set document title on route change
router.afterEach((to) => {
    document.title = to.meta?.title ? `${to.meta.title} - ${defaultDocumentTitle}` : defaultDocumentTitle;
});

// Set theme from local storage or system preference
if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem('darkMode') === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        mainStore.darkMode = true;
    } else {
        mainStore.darkMode = localStorage.getItem('darkMode') === 'true';
    }
}
