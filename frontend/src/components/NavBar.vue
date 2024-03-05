<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import BaseIcon from '@/components/BaseIcon.vue';
import { RouterLink } from 'vue-router';
import originalMenu from '@/menus/menuNavBar.js';
import { useMainStore } from '@/stores/mainStore.js';
import { useAuthStore } from '@/stores/authStore.js';

const router = useRouter();
const mainStore = useMainStore();
const authStore = useAuthStore();

const isAuth = computed(() => authStore.auth);

const menu = computed(() => {
    return originalMenu.filter((item) => item.isAuth === undefined || item.isAuth === isAuth.value);
});

const menuClick = (item) => {
    if (item.isToggleTheme) {
        mainStore.toggleTheme();
    }
    if (item.isToggleLang) {
        mainStore.toggleLang();
    }
    if (item.isLogout) {
        authStore.logout();
        if (router.currentRoute.value.name === 'profile') {
            router.push({ name: 'login' });
        }
    }
};
</script>

<template>
    <nav
        class="top-0 inset-x-0 fixed h-14 z-30 transition-position transition-all w-screen shadow-md bg-blue-300/90 dark:bg-gray-800/90"
    >
        <div class="grid justify-items-center grid-cols-6 gap-4 max-w-7xl mx-auto h-full">
            <div v-for="item in menu" :key="item.label">
                <component
                    :is="item.route ? RouterLink : item.href ? 'a' : 'button'"
                    :to="item.route"
                    :href="item.href ?? null"
                    :title="mainStore.lang === 'pt' ? item.labelPT || item.hoverPT : item.label || item.hover"
                    class="flex items-center h-14 px-2 transition-all cursor-pointer hover:font-medium dark:hover:text-sky-500 hover:scale-105"
                    :target="item.href ? '_blank' : null"
                    :class="
                        item.hover
                            ? 'text-blue-600 dark:text-sky-200 hover:text-blue-900'
                            : 'text-black dark:text-white hover:text-blue-700'
                    "
                    @click="item.route ? null : menuClick(item)"
                >
                    <BaseIcon :path="item.icon" />
                    <span v-if="item.label" class="px-2 hidden md:inline-flex">{{
                        mainStore.lang === 'pt' ? item.labelPT : item.label
                    }}</span>
                </component>
            </div>
        </div>
    </nav>
</template>
