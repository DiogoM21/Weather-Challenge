<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import BaseIcon from './BaseIcon.vue';

const props = defineProps({
    label: {
        type: [String, Number],
        default: null,
    },
    icon: {
        type: String,
        default: null,
    },
    route: {
        type: String,
        default: null,
    },
    href: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        default: null,
    },
    color: {
        type: String,
        default: null,
    },
    outline: Boolean,
    disabled: Boolean,
});

const componentClass = computed(() => {
    const baseClasses =
        'flex items-center justify-center gap-1 px-4 py-1.5 rounded-md hover:scale-105 hover:font-medium transition-all';
    const cursorClass = props.disabled ? 'cursor-not-allowed' : 'cursor-pointer';
    let clr;
    switch (props.color) {
        case 'success':
            clr = 'border-2 bg-emerald-600 dark:bg-emerald-600 border-emerald-600 dark:border-emerald-600 text-white';
            break;
        case 'error':
            clr = 'border-2 bg-red-500 dark:bg-red-500 border-red-500 dark:border-red-500 text-white';
            break;
        default:
            clr =
                'border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black';
    }
    return [baseClasses, cursorClass, clr];
});
</script>

<template>
    <component
        :is="route ? RouterLink : href ? 'a' : 'button'"
        :to="route"
        :href="href ?? null"
        :class="componentClass"
        :type="type"
        :disabled="disabled"
    >
        <BaseIcon v-if="icon" :path="icon" />
        <span v-if="label">{{ label }}</span>
    </component>
</template>
