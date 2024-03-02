<script setup>
import { computed } from 'vue';
import BaseIcon from '@/components/BaseIcon.vue';
import { RouterLink } from 'vue-router';
import originalMenu from '@/menuNavBar.js';
import { useMainStore } from '@/stores/main.js';
import { useAuthStore } from '@/stores/auth.js';

const mainStore = useMainStore();
const authStore = useAuthStore();

const isAuth = authStore.auth;
const isLangPT = computed(() => mainStore.lang === 'pt');

const menu = originalMenu.filter((item) => item.isAuth === undefined || item.isAuth === isAuth);

const menuClick = (item) => {
    if (item.isToggleTheme) {
        mainStore.toggleTheme();
    }
    if (item.isToggleLang) {
        mainStore.toggleLang();
    }
    if (item.isLogout) {
        //
    }
};
</script>

<template>
    <nav class="top-0 inset-x-0 fixed h-14 z-30 transition-position w-screen bg-gray-50 dark:bg-slate-800 shadow-md">
        <div class="grid justify-items-center grid-cols-6 gap-4 max-w-7xl mx-auto h-full">
            <div v-for="item in menu" :key="item.label">
                <component
                    :is="item.route ? RouterLink : 'div'"
                    :to="item.route"
                    :title="isLangPT ? item.labelPT || item.hoverPT : item.label || item.hover"
                    class="flex items-center h-14 px-2 transition-colors hover:text-sky-700 text-gray-800 dark:text-white dark:hover:text-sky-500 cursor-pointer"
                    @click="item.route ? null : menuClick(item)"
                >
                    <BaseIcon :path="item.icon" />
                    <span v-if="item.label" class="px-2 hidden md:inline-flex">{{
                        isLangPT ? item.labelPT : item.label
                    }}</span>
                </component>
            </div>
        </div>
    </nav>
</template>
