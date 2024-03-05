<script setup>
import { reactive } from 'vue';
import { mdiEmail, mdiAsterisk, mdiLoginVariant, mdiCloseCircleOutline } from '@mdi/js';
import { useMainStore } from '@/stores/mainStore.js';
import { useAuthStore } from '@/stores/authStore.js';
import CardBox from '@/components/CardBox.vue';
import FormField from '@/components/FormField.vue';
import BaseButton from '@/components/BaseButton.vue';
import MainLayout from '@/components/MainLayout.vue';

const mainStore = useMainStore();
const authStore = useAuthStore();

const form = reactive({
    email: '',
    password: '',
});

const submit = async () => {
    await authStore.login(form.email, form.password, mainStore.lang);
};
</script>

<template>
    <MainLayout>
        <CardBox small is-form @submit.prevent="submit">
            <span class="text-4xl font-semibold mb-2">
                {{ mainStore.lang === 'pt' ? 'Entrar' : 'Login' }}
            </span>
            <div class="flex flex-col gap-4 my-4">
                <FormField
                    id="email"
                    v-model="form.email"
                    :icon="mdiEmail"
                    label="Email"
                    type="email"
                    autocomplete="email"
                    :min="0"
                    :max="255"
                    :help="mainStore.lang === 'pt' ? 'Email da sua conta. Obrigatório' : 'Your account email. Required'"
                    required
                />
                <FormField
                    id="password"
                    v-model="form.password"
                    :icon="mdiAsterisk"
                    label="Palavra-Passe"
                    type="password"
                    autocomplete="current-password"
                    :min="0"
                    :max="255"
                    :help="
                        mainStore.lang === 'pt'
                            ? 'Palavra-passe da sua conta. Obrigatório'
                            : 'Your account password. Required'
                    "
                    required
                />
            </div>
            <div class="flex justify-between items-center gap-6 my-4">
                <BaseButton
                    type="submit"
                    color="success"
                    :label="mainStore.lang === 'pt' ? 'Entrar' : 'Login'"
                    :icon="mdiLoginVariant"
                    :class="{ 'opacity-25': form.processing || !form.email || !form.password }"
                    :disabled="form.processing || !form.email || !form.password"
                />
                <BaseButton
                    :icon="mdiCloseCircleOutline"
                    :label="mainStore.lang === 'pt' ? 'Voltar' : 'Back'"
                    route="home"
                />
            </div>
        </CardBox>
    </MainLayout>
</template>
