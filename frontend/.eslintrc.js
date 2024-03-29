module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', 'prettier'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error',
        'vue/script-setup-uses-vars': 'error',
    },
    globals: {
        defineProps: 'readonly',
        defineEmits: 'readonly',
    },
};
