import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import './style.css';

// Init Pinia
const pinia = createPinia();

// Create Vue app
createApp(App).use(router).use(pinia).mount('#app');

const defaultDocumentTitle = 'Weather App';

// Set document title from route meta
router.afterEach((to) => {
    document.title = to.meta?.title ? `${to.meta.title} - ${defaultDocumentTitle}` : defaultDocumentTitle;
});
