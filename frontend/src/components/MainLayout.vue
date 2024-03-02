<script setup>
import NavBar from './NavBar.vue';
import LogoBar from './LogoBar.vue';
import FooterBar from './FooterBar.vue';
import { useMainStore } from '@/stores/main.js';

const mainStore = useMainStore();
</script>

<template>
    <div :class="{ dark: mainStore.darkMode }">
        <div
            class="flex flex-col pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gradient-to-b from-gray-50 to-gray-200 dark:from-slate-800/90 dark:to-slate-900/90 dark:text-slate-100 selection:bg-slate-800 selection:text-slate-100 dark:selection:bg-slate-100 dark:selection:text-slate-900"
        >
            <div class="flex-grow">
                <NavBar />
                <LogoBar />
                <slot />
            </div>
            <FooterBar />
        </div>
    </div>
</template>
