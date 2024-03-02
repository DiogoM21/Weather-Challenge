<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
    isForm: Boolean,
    isModal: Boolean,
});

const emit = defineEmits(['submit']);
</script>

<template>
    <component
        :is="isForm ? 'form' : 'div'"
        class="flex items-center justify-center rounded-2xl py-4 my-4 mx-24 2xl:mx-48 bg-white dark:bg-slate-900/70 shadow-md"
        @submit="emit('submit')"
    >
        <slot />
    </component>
</template>
