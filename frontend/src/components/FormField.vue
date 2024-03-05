<script setup>
import { computed } from 'vue';
import { mdiMinus, mdiPlus } from '@mdi/js';
import BaseIcon from './BaseIcon.vue';

const props = defineProps({
    modelValue: {
        type: [String, Number, Boolean, Object, Array],
        default: null,
    },
    id: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        default: 'text',
    },
    autocomplete: {
        type: String,
        default: null,
    },
    options: {
        type: Array,
        default: () => [],
    },
    label: {
        type: String,
        default: null,
    },
    help: {
        type: String,
        default: null,
    },
    min: {
        type: Number,
        default: 0,
    },
    max: {
        type: Number,
        default: 10,
    },
    icon: {
        type: String,
        default: null,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    required: {
        type: Boolean,
        default: false,
    },
    small: {
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
            <label v-if="label" :for="id" class="block font-bold mb-2">{{ label }}</label>
            <div class="relative text-black dark:text-white">
                <select
                    v-if="type === 'select'"
                    :id="id"
                    :value="computedValue"
                    :disabled="disabled || (options && options.length === 0)"
                    class="bg-gray-50 dark:bg-gray-600/60 focus:ring focus:outline-none border-gray-500 dark:border-gray-900 rounded-lg"
                    :class="
                        (disabled || (options && options.length === 0) ? 'cursor-not-allowed' : 'cursor-pointer',
                        small ? 'px-2 py-1.5 pl-9 min-w-44' : 'px-2 py-2 pl-9 min-w-64')
                    "
                    @input="computedValue = $event.target.value"
                >
                    <option v-for="option in options" :key="option.id" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>
                <div
                    v-else-if="type === 'numberButton'"
                    class="flex flex-row items-center gap-4 justify-center my-auto"
                    :class="{ 'animate-pulse': disabled }"
                >
                    <BaseIcon
                        :path="mdiMinus"
                        :size="16"
                        :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
                        @click="disabled || (computedValue - 1 >= min && (computedValue -= 1))"
                    />
                    <span class="text-lg font-medium text-center w-5">{{ computedValue }}</span>
                    <BaseIcon
                        :path="mdiPlus"
                        :size="16"
                        :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
                        @click="disabled || (computedValue + 1 <= max && (computedValue += 1))"
                    />
                </div>
                <input
                    v-else
                    :id="id"
                    v-model="computedValue"
                    :type="type"
                    :autocomplete="autocomplete"
                    :disabled="disabled"
                    :minlength="min"
                    :maxlength="max"
                    class="px-2 py-2 pl-9 min-w-64 max-w-full bg-gray-50 dark:bg-gray-600/60 focus:ring focus:outline-none border-gray-500 dark:border-gray-900 rounded-lg"
                    :class="{ 'cursor-not-allowed': disabled }"
                />
                <div v-if="help" class="text-xs mt-1 text-black dark:text-gray-400">
                    {{ help }}
                </div>
                <BaseIcon v-if="icon" :path="icon" :size="16" class="absolute z-10 pointer-events-none top-2 left-2" />
            </div>
        </div>
    </div>
</template>
