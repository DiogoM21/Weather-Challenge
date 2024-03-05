<script setup>
import { reactive, onMounted, computed, watchEffect } from 'vue';
import {
    mdiEmail,
    mdiAsterisk,
    mdiAccountPlus,
    mdiCloseCircleOutline,
    mdiTemperatureCelsius,
    mdiTemperatureKelvin,
    mdiTemperatureFahrenheit,
    mdiTranslateVariant,
    mdiAccountBox,
} from '@mdi/js';
import { useMainStore } from '@/stores/mainStore.js';
import { useAuthStore } from '@/stores/authStore.js';
import { useCityStore } from '@/stores/cityStore.js';
import CardBox from '@/components/CardBox.vue';
import FormField from '@/components/FormField.vue';
import BaseButton from '@/components/BaseButton.vue';
import MainLayout from '@/components/MainLayout.vue';

const mainStore = useMainStore();
const authStore = useAuthStore();
const cityStore = useCityStore();

const selectCities = computed(() => cityStore.cities);
const user = computed(() => authStore.user);

const selectUnits = [
    { label: 'Celsius', value: 'metric', icon: mdiTemperatureCelsius },
    { label: 'Kelvin', value: 'default', icon: mdiTemperatureKelvin },
    { label: 'Fahrenheit', value: 'imperial', icon: mdiTemperatureFahrenheit },
];

const selectLangs = [
    { label: 'Português', value: 'pt' },
    { label: 'English', value: 'en' },
];

const form = reactive({
    email: '',
    password: '',
    name: '',
    city_code: '',
    unit: selectUnits[0].value,
    lang: '',
    created_at: '',
});

watchEffect(() => {
    if (user.value) {
        form.email = user.value.email;
        form.name = user.value.name;
        form.city_code = user.value.city_code;
        form.unit = user.value.unit || selectUnits[0].value;
        form.lang = user.value.lang || mainStore.lang;
        form.created_at = user.value.created_at;
    }
});

const submit = async () => {
    await authStore.updateUser(form.email, form.password, form.name, form.city_code, form.unit, form.lang);
};

onMounted(async () => {
    if (!cityStore.cities || cityStore.cities.length === 0) {
        await cityStore.getAPICities(true).then((cities) => {
            if (cities && cities.length > 0) {
                if (!form.city_code) {
                    form.city_code = cities[0].value;
                } else {
                    const city = cities.find((c) => c.value === form.city_code);
                    if (!city) {
                        form.city_code = cities[0].value;
                    }
                }
            }
        });
    } else {
        if (!form.city_code) {
            form.city_code = cityStore.cities[0].value;
        }
    }
});
</script>

<template>
    <MainLayout>
        <CardBox small is-form @submit.prevent="submit">
            <span class="text-4xl font-semibold mb-2">
                {{ mainStore.lang === 'pt' ? 'Perfil' : 'Profile' }}
            </span>
            <div class="flex flex-col lg:flex-row gap-4 my-4">
                <div class="flex flex-col gap-4">
                    <FormField
                        id="email"
                        v-model="form.email"
                        :icon="mdiEmail"
                        label="Email"
                        type="email"
                        autocomplete="email"
                        :min="0"
                        :max="255"
                        :help="
                            mainStore.lang === 'pt' ? 'Email da sua conta. Obrigatório' : 'Your account email. Required'
                        "
                        required
                    />
                    <FormField
                        id="password"
                        v-model="form.password"
                        :icon="mdiAsterisk"
                        label="Palavra-Passe"
                        type="password"
                        autocomplete="current-password"
                        :min="6"
                        :max="255"
                        :help="
                            mainStore.lang === 'pt'
                                ? 'Palavra-passe da sua conta. Obrigatório'
                                : 'Your account password. Required'
                        "
                        required
                    />
                    <FormField
                        id="name"
                        v-model="form.name"
                        :icon="mdiAccountBox"
                        label="Nome"
                        type="text"
                        autocomplete="name"
                        :min="3"
                        :max="255"
                        :help="
                            mainStore.lang === 'pt' ? 'Nome da sua conta. Obrigatório' : 'Your account name. Required'
                        "
                        required
                    />
                </div>
                <div class="flex flex-col gap-4">
                    <FormField
                        id="city"
                        v-model="form.city_code"
                        :icon="mdiAccountPlus"
                        label="Cidade"
                        type="select"
                        :options="selectCities"
                        :help="
                            mainStore.lang === 'pt' ? 'Cidade da sua conta. Obrigatório' : 'Your account city. Required'
                        "
                        required
                    />
                    <FormField
                        id="unit"
                        v-model="form.unit"
                        :icon="selectUnits.find((unit) => unit.value === form.unit).icon"
                        label="Unidade"
                        type="select"
                        :options="selectUnits"
                        :help="
                            mainStore.lang === 'pt'
                                ? 'Unidade de temperatura. Obrigatório'
                                : 'Temperature unit. Required'
                        "
                        required
                    />
                    <FormField
                        id="lang"
                        v-model="form.lang"
                        :icon="mdiTranslateVariant"
                        label="Idioma"
                        type="select"
                        :options="selectLangs"
                        :help="
                            mainStore.lang === 'pt'
                                ? 'Idioma da sua conta. Obrigatório'
                                : 'Your account language. Required'
                        "
                        required
                    />
                </div>
            </div>
            <div class="flex justify-center lg:justify-end my-2 lg:my-1 w-full px-8">
                <span
                    class="text-md font-semibold text-gray-700 dark:text-slate-400"
                    :title="mainStore.lang === 'pt' ? 'Conta criada em' : 'Account created at'"
                    >{{ form.created_at ?? null }}</span
                >
            </div>
            <div class="flex justify-between items-center gap-6 my-4">
                <BaseButton
                    type="submit"
                    color="sucess"
                    :label="mainStore.lang === 'pt' ? 'Guardar' : 'Save'"
                    :icon="mdiAccountPlus"
                    :class="{
                        'opacity-25':
                            form.processing || !form.email || !form.name || !form.city_code || !form.unit || !form.lang,
                    }"
                    :disabled="
                        form.processing || !form.email || !form.name || !form.city_code || !form.unit || !form.lang
                    "
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
