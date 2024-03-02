<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import BaseIcon from './BaseIcon.vue';

const props = defineProps({
    modelValue: {
        type: [String, Number, Boolean, Object, Array],
        default: null,
    },
    type: {
        type: String,
        default: 'text',
    },
    options: {
        type: Array,
        default: () => [],
    },
    label: {
        type: String,
        default: null,
    },
    icon: {
        type: String,
        default: null,
    },
});

const emit = defineEmits(['update:modelValue', 'setRef']);

const computedValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
    },
});
</script>

<template>
    <div>
        <div class="flex-grow">
            <label v-if="label" :for="label" class="block font-bold mb-2">{{ label }}</label>
            <div class="relative text-gray-900 dark:text-white">
                <select
                    v-if="type === 'select'"
                    :id="label"
                    :value="computedValue"
                    class="px-2 py-1 pl-9 min-w-44 max-w-full bg-gray-50 dark:bg-gray-600/60 focus:ring focus:outline-none border-gray-500 dark:border-gray-900 rounded-lg w-full cursor-pointer"
                    @input="computedValue = $event.target.value"
                >
                    <option v-for="option in options" :key="option.id" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>
                <BaseIcon :path="icon" :size="16" class="absolute top-1.5 left-2 z-10 pointer-events-none" />
            </div>
        </div>
    </div>
</template>
