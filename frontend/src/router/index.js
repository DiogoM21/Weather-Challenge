import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {
        meta: {
            title: 'Home',
            titlePT: 'Início',
        },
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
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
