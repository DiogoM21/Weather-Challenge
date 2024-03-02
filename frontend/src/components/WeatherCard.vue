<script setup>
import { ref, onMounted, watch } from 'vue';
import { mdiReload, mdiHomeCity, mdiTemperatureCelsius, mdiTemperatureKelvin, mdiTemperatureFahrenheit } from '@mdi/js';
import CardBox from './CardBox.vue';
import BaseIcon from './BaseIcon.vue';
import FormField from './FormField.vue';
import { useMainStore } from '@/stores/main';
import { useWeatherStore } from '@/stores/weather';

const mainStore = useMainStore();
const weatherStore = useWeatherStore();

const weather = ref(weatherStore.weather);

const selectUnits = [
    { label: 'Celsius', value: 'metric', icon: mdiTemperatureCelsius },
    { label: 'Kelvin', value: 'default', icon: mdiTemperatureKelvin },
    { label: 'Fahrenheit', value: 'imperial', icon: mdiTemperatureFahrenheit },
];

const selectCities = [
    { label: 'Leiria', value: '2267094' },
    { label: 'Lisboa', value: '2267056' },
    { label: 'Coimbra', value: '2740636' },
    { label: 'Porto', value: '2735941' },
    { label: 'Faro', value: '2268337' },
];

const selectedCity = ref('2267094');
const selectedUnit = ref('metric');

async function getCurrentWeather() {
    weather.value = await weatherStore.getCurrentWeather('2267094', weatherStore.unit, mainStore.lang);
}

onMounted(async () => {
    await getCurrentWeather();
});

watch(
    () => mainStore.lang,
    async () => {
        await getCurrentWeather();
    },
);
</script>

<template>
    <CardBox :updated="weather?.info.dt">
        <div class="flex flex-row items-center my-5 justify-evenly w-full text-gray-900 dark:text-white">
            <div class="flex flex-col items-center gap-4 justify-center">
                <FormField
                    v-model="selectedCity"
                    type="select"
                    :options="selectCities"
                    label="Cidade:"
                    :icon="mdiHomeCity"
                />
                <FormField
                    v-model="selectedUnit"
                    type="select"
                    :options="selectUnits"
                    label="Unidade:"
                    :icon="selectUnits.find((unit) => unit.value === selectedUnit).icon"
                />
            </div>
            <div class="flex flex-row items-center gap-4 justify-center">
                <div>
                    <img
                        :src="
                            weather?.info.icon
                                ? `http://openweathermap.org/img/wn/${weather?.info.icon}@4x.png`
                                : require('@/assets/weather.png')
                        "
                        :alt="weather?.info.description"
                        :title="weather?.info.description"
                        class="w-32 h-32"
                    />
                </div>
                <div>
                    <div class="flex flex-row items-center gap-4 justify-center">
                        <span class="text-4xl">Leiria</span>
                        <span class="text-4xl font-bold">{{ weather?.values.temp ?? 0 }}°C</span>
                    </div>
                    <div class="flex flex-row items-center gap-4 justify-center mt-4">
                        <span class="text-xl"
                            >{{ mainStore.lang === 'pt' ? 'Humidade' : 'Humidity' }}:
                            {{ weather?.values.humidity ?? 0 }}%</span
                        >
                        <BaseIcon
                            :path="mdiReload"
                            :size="24"
                            :title="mainStore.lang === 'pt' ? 'Atualizar' : 'Refresh'"
                            class="mt-1 hover:text-blue-900 dark:hover:text-sky-500 cursor-pointer transition-colors"
                            @click="getCurrentWeather"
                        />
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-end">
                <span class="text-sm font-bold text-gray-700 dark:text-slate-400">{{ weather?.info.dt ?? null }}</span>
            </div>
        </template>
    </CardBox>
</template>
