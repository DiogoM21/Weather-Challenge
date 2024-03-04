<script setup>
import { computed } from 'vue';
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
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:modelValue']);

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
                    :disabled="disabled || (options && options.length === 0)"
                    class="px-2 py-1 pl-9 min-w-44 max-w-full bg-gray-50 dark:bg-gray-600/60 focus:ring focus:outline-none border-gray-500 dark:border-gray-900 rounded-lg w-full"
                    :class="disabled || (options && options.length === 0) ? 'cursor-not-allowed' : 'cursor-pointer'"
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
