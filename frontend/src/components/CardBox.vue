<script setup>
import { useSlots, computed } from 'vue';

defineProps({
    isForm: Boolean,
    isModal: Boolean,
});

const emit = defineEmits(['submit']);

const slots = useSlots();

const hasFooter = computed(() => slots.footer && !!slots.footer());
</script>

<template>
    <component
        :is="isForm ? 'form' : 'div'"
        class="flex flex-col items-center justify-center rounded-2xl py-6 lg:py-10 my-2 mx-12 md:mx-28 2xl:mx-64 bg-gradient-to-b from-blue-300/80 to-blue-400/80 dark:from-gray-800/90 dark:to-gray-900/90 shadow-md"
        @submit="emit('submit')"
    >
        <slot />
        <footer v-if="hasFooter" class="px-6 mt-4 lg:mt-0 w-full">
            <slot name="footer" />
        </footer>
    </component>
</template>
