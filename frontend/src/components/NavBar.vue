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
    <nav
        class="top-0 inset-x-0 fixed h-14 z-30 transition-position transition-all w-screen shadow-md bg-blue-300/90 dark:bg-gray-800/90"
    >
        <div class="grid justify-items-center grid-cols-6 gap-4 max-w-7xl mx-auto h-full">
            <div v-for="item in menu" :key="item.label">
                <component
                    :is="item.route ? RouterLink : item.href ? 'a' : 'div'"
                    :to="item.route"
                    :href="item.href"
                    :title="isLangPT ? item.labelPT || item.hoverPT : item.label || item.hover"
                    class="flex items-center h-14 px-2 transition-all cursor-pointer hover:font-medium dark:hover:text-sky-500 hover:scale-105"
                    target="_blank"
                    :class="
                        item.hover
                            ? 'text-blue-600 dark:text-sky-200 hover:text-blue-900'
                            : 'text-black dark:text-white hover:text-blue-700'
                    "
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
