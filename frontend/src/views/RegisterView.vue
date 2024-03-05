<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
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

const router = useRouter();

const mainStore = useMainStore();
const authStore = useAuthStore();
const cityStore = useCityStore();

const selectCities = ref(null);

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
    city: '',
    unit: selectUnits[0].value,
    lang: mainStore.lang,
});

const submit = async () => {
    await authStore.register(form.email, form.password, form.name, form.city, form.unit, form.lang).then((success) => {
        if (success) {
            router.push({ name: 'home' });
        }
    });
};

onMounted(async () => {
    await cityStore.getAPICities(true).then((cities) => {
        if (cities && cities.length > 0) {
            selectCities.value = cities;
            if (!form.city) {
                form.city = cities[0].value;
            } else {
                const city = cities.find((c) => c.value === form.city);
                if (!city) {
                    form.city = cities[0].value;
                }
            }
        }
    });
});
</script>

<template>
    <MainLayout>
        <CardBox small is-form @submit="submit">
            <span class="text-4xl font-semibold mb-2">
                {{ mainStore.lang === 'pt' ? 'Registar' : 'Register' }}
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
                        v-model="form.city"
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
            <div class="flex justify-between items-center gap-6 my-4">
                <BaseButton
                    type="submit"
                    color="sucess"
                    :label="mainStore.lang === 'pt' ? 'Registar' : 'Register'"
                    :icon="mdiAccountPlus"
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
