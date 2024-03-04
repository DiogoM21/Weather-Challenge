<script setup>
import { ref, onMounted, watch } from 'vue';
import { mdiReload, mdiHomeCity, mdiTemperatureCelsius, mdiTemperatureKelvin, mdiTemperatureFahrenheit } from '@mdi/js';
import CardBox from './CardBox.vue';
import BaseIcon from './BaseIcon.vue';
import FormField from './FormField.vue';
import { useMainStore } from '@/stores/main';
import { useCityStore } from '@/stores/city';
import { useWeatherStore } from '@/stores/weather';

const mainStore = useMainStore();
const cityStore = useCityStore();
const weatherStore = useWeatherStore();

const weather = ref(null);
const isRefreshing = ref(false);

const selectUnits = [
    { label: 'Celsius', value: 'metric', icon: mdiTemperatureCelsius },
    { label: 'Kelvin', value: 'default', icon: mdiTemperatureKelvin },
    { label: 'Fahrenheit', value: 'imperial', icon: mdiTemperatureFahrenheit },
];

const selectCities = ref(null);
const selectedCity = ref(null);
const selectedUnit = ref(selectUnits.find((unit) => unit.value === weatherStore.selectedUnit).value);

async function getCities(force = false) {
    isRefreshing.value = true;
    await cityStore
        .getCities(force)
        .then((cities) => {
            if (cities && cities.length > 0) {
                selectCities.value = cities;
                selectedCity.value = cities[0].value;
                if (force) {
                    getCurrentWeather(true);
                }
            }
        })
        .finally(() => {
            isRefreshing.value = false;
        });
}

async function getCurrentWeather(force = false) {
    isRefreshing.value = true;
    weatherStore
        .getCurrentWeather(selectedCity.value, selectedUnit.value, force)
        .then((data) => {
            if (data) {
                weather.value = data;
            }
        })
        .finally(() => {
            isRefreshing.value = false;
        });
}

onMounted(async () => {
    await getCities();
});

watch([() => mainStore.lang, () => selectedCity.value, () => selectedUnit.value], async () => {
    await getCurrentWeather();
});

function getTempColor(temp) {
    let cold = 'text-blue-600 dark:text-blue-500';
    let hot = 'text-red-600 dark:text-red-500';
    let warm = 'text-yellow-600 dark:text-yellow-500';
    switch (selectedUnit.value) {
        case 'imperial':
            return temp > 80 ? hot : temp < 60 ? cold : warm;
        case 'metric':
            return temp > 27 ? hot : temp < 15 ? cold : warm;
        case 'default':
            return temp > 300 ? hot : temp < 288 ? cold : warm;
        default:
            return 'text-gray-900 dark:text-white';
    }
}

function getUnitSymbol() {
    switch (selectedUnit.value) {
        case 'metric':
            return '°C';
        case 'default':
            return 'K';
        case 'imperial':
            return '°F';
        default:
            return '°C';
    }
}

function getWindSymbol() {
    switch (selectedUnit.value) {
        case 'imperial':
            return 'mph';
        case 'metric':
        case 'default':
            return 'm/s';
        default:
            return 'm/s';
    }
}
</script>

<template>
    <CardBox :updated="weather?.info.dt">
        <div class="flex flex-col lg:flex-row items-center justify-evenly w-full text-gray-900 dark:text-white">
            <div class="flex flex-row lg:flex-col mb-6 lg:mb-0 items-center gap-4 justify-center">
                <FormField
                    v-model="selectedCity"
                    type="select"
                    :options="selectCities"
                    :disabled="isRefreshing"
                    :label="mainStore.lang === 'pt' ? 'Cidade:' : 'City:'"
                    :icon="mdiHomeCity"
                />
                <FormField
                    v-model="selectedUnit"
                    type="select"
                    :options="selectUnits"
                    :disabled="isRefreshing"
                    :label="mainStore.lang === 'pt' ? 'Unidade:' : 'Unit:'"
                    :icon="selectUnits.find((unit) => unit.value === selectedUnit).icon"
                />
            </div>
            <div
                class="flex flex-row items-center gap-2 md:gap-4 justify-center"
                :class="isRefreshing ? 'animate-pulse' : ''"
            >
                <div>
                    <img
                        :src="
                            weather?.info.icon
                                ? `http://openweathermap.org/img/wn/${weather?.info.icon}@4x.png`
                                : require('@/assets/weather.png')
                        "
                        :alt="weather?.info.description"
                        :title="weather?.info.description"
                        class="w-24 h-24 md:w-32 md:h-32"
                    />
                </div>
                <div>
                    <div class="flex flex-row items-center gap-4 justify-center">
                        <span class="text-3xl md:text-4xl">{{
                            weather?.info.city ?? (mainStore.lang === 'pt' ? 'Cidade' : 'City')
                        }}</span>
                        <span class="text-3xl md:text-4xl font-bold" :class="getTempColor(weather?.values.temp ?? 0)"
                            >{{ weather?.values.temp ?? 0 }}{{ getUnitSymbol() }}</span
                        >
                    </div>
                    <div class="flex flex-row items-center gap-4 justify-center mt-4">
                        <span class="text-md md:text-xl text-gray-900 dark:text-gray-400"
                            >{{ mainStore.lang === 'pt' ? 'Vento' : 'Wind' }}: {{ weather?.values.wind ?? 0
                            }}{{ getWindSymbol() }}</span
                        >
                        <span class="text-md md:text-xl text-gray-900 dark:text-gray-400"
                            >{{ mainStore.lang === 'pt' ? 'Direção' : 'Direction' }}:
                            {{ weather?.values.deg ?? 0 }}°</span
                        >
                    </div>
                    <div class="flex flex-row items-center gap-4 justify-center mt-4">
                        <span class="text-md md:text-xl text-gray-900 dark:text-gray-300"
                            >{{ mainStore.lang === 'pt' ? 'Humidade' : 'Humidity' }}:
                            {{ weather?.values.humidity ?? 0 }}%</span
                        >
                        <BaseIcon
                            :path="mdiReload"
                            :size="24"
                            :title="mainStore.lang === 'pt' ? 'Forçar atualização' : 'Force update'"
                            class="mt-0 md:mt-1 hover:text-blue-900 dark:hover:text-sky-500 transition-colors"
                            :class="isRefreshing ? 'cursor-not-allowed' : 'cursor-pointer'"
                            @click="isRefreshing ? null : getCities(true)"
                        />
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-end">
                <span class="text-sm font-semibold text-gray-700 dark:text-slate-400">{{
                    weather?.info.dateTime ?? null
                }}</span>
            </div>
        </template>
    </CardBox>
</template>
