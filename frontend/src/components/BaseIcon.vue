<script setup>
defineProps({
    path: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        default: 16,
    },
});
</script>

<template>
    <span class="inline-flex justify-center items-center w-6 h-6">
        <svg viewBox="0 0 24 24" :width="size" :height="size" class="inline-block">
            <path fill="currentColor" :d="path" />
        </svg>
        <slot />
    </span>
</template>
