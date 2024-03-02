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
        meta: {
            title: 'Page',
            titlePT: 'Página',
        },
        path: '/page',
        name: 'page',
        component: () => import('../views/PageView.vue'),
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
