import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {
        meta: {
            title: 'Home',
        },
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 };
    },
});

export default router;
