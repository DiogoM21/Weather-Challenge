<script setup>
import NavBar from './NavBar.vue';
import FooterBar from './FooterBar.vue';
</script>

<template>
    <div
        class="min-h-screen flex flex-col pt-14 w-auto bg-gray-300/70 dark:bg-slate-900/90 dark:text-slate-100 selection:bg-slate-800 selection:text-slate-100 dark:selection:bg-slate-100 dark:selection:text-slate-900"
    >
        <NavBar />
        <slot class="flex-grow" />
        <FooterBar />
    </div>
</template>
