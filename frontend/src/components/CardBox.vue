<script setup>
import { useSlots, computed } from 'vue';

defineProps({
    isForm: Boolean,
    small: Boolean,
});

const emit = defineEmits(['submit']);

const slots = useSlots();

const hasFooter = computed(() => slots.footer && !!slots.footer());

const submit = (event) => {
    emit('submit', event);
};
</script>

<template>
    <component
        :is="isForm ? 'form' : 'div'"
        :class="small ? 'mx-20 md:mx-44 lg:mx-52 xl:mx-86 2xl:mx-96' : 'mx-12 md:mx-28 lg:mx-36 xl:mx-48 2xl:mx-80'"
        class="flex flex-col items-center justify-center rounded-2xl py-8 my-2 bg-gradient-to-b from-blue-300/80 to-blue-400/80 dark:from-gray-800/90 dark:to-gray-900/90 shadow-md transition-all"
        @submit="submit"
    >
        <slot />
        <footer v-if="hasFooter" class="px-6 w-full">
            <slot name="footer" />
        </footer>
    </component>
</template>
