<script setup>
import BaseIcon from '@/components/BaseIcon.vue';
import menu from '@/menuNavBar.js';
</script>

<template>
    <nav class="top-0 inset-x-0 fixed bg-gray-50 h-14 z-30 transition-position w-screen dark:bg-slate-800">
        <div class="flex items-center justify-center h-full mx-auto max-w-7xl">
            <div
                v-for="item in menu"
                :key="item.label"
                class="block lg:flex items-center relative cursor-pointer mx-12"
            >
                <div
                    :title="item.hover || item.label"
                    class="flex items-center h-14 px-2 transition-colors dark:text-white dark:hover:text-gray-400"
                >
                    <BaseIcon :path="item.icon" />
                    <span v-if="item.label" class="px-2">{{ item.label }}</span>
                </div>
            </div>
        </div>
    </nav>
</template>
