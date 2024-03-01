<script setup>
import { computed, defineProps } from 'vue';

defineProps({
    path: {
        type: String,
        required: true,
    },
});

const spanClass = computed(() => `inline-flex justify-center items-center w-6 h-6`);
</script>

<template>
    <span :class="spanClass">
        <svg viewBox="0 0 24 24" :width="16" :height="16" class="inline-block">
            <path fill="currentColor" :d="path" />
        </svg>
        <slot />
    </span>
</template>
