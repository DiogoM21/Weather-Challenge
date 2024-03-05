<script setup>
import { ref, onMounted, watch } from 'vue';
import {
    mdiReload,
    mdiHomeCity,
    mdiTemperatureCelsius,
    mdiTemperatureKelvin,
    mdiTemperatureFahrenheit,
    mdiArrowUp,
    mdiArrowTopRight,
    mdiArrowRight,
    mdiArrowBottomRight,
    mdiArrowDown,
    mdiArrowBottomLeft,
    mdiArrowLeft,
    mdiArrowTopLeft,
} from '@mdi/js';
import CardBox from './CardBox.vue';
import BaseIcon from './BaseIcon.vue';
import FormField from './FormField.vue';
import NextWeatherCard from './NextWeatherCard.vue';
import { useMainStore } from '@/stores/main';
import { useCityStore } from '@/stores/city';
import { useWeatherStore } from '@/stores/weather';

const mainStore = useMainStore();
const cityStore = useCityStore();
const weatherStore = useWeatherStore();

const weather = ref(null);
const filteredNextWeather = ref(null);
const isRefreshing = ref(false);
const showNext = ref(true);

const selectUnits = [
    { label: 'Celsius', value: 'metric', icon: mdiTemperatureCelsius },
    { label: 'Kelvin', value: 'default', icon: mdiTemperatureKelvin },
    { label: 'Fahrenheit', value: 'imperial', icon: mdiTemperatureFahrenheit },
];

const selectCities = ref(null);
const selectedCity = ref(null);
const selectedUnit = ref(selectUnits.find((unit) => unit.value === weatherStore.selectedUnit).value);
const selectedCount = ref(5);

async function getCities(force = false) {
    isRefreshing.value = true;
    await cityStore
        .getAPICities(force)
        .then((cities) => {
            if (cities && cities.length > 0) {
                selectCities.value = cities;
                if (!selectedCity.value) {
                    selectedCity.value = cities[0].value;
                } else {
                    const city = cities.find((c) => c.value === selectedCity.value);
                    if (!city) {
                        selectedCity.value = cities[0].value;
                    }
                }
                if (force) {
                    getAPIWeather(true);
                }
            }
        })
        .finally(() => {
            isRefreshing.value = false;
        });
}

async function getAPIWeather(force = false) {
    isRefreshing.value = true;
    weatherStore
        .getAPIWeather(selectedCity.value, selectedUnit.value, force)
        .then((data) => {
            if (data) {
                weather.value = data;
                filteredNextWeather.value = data.next.slice(0, selectedCount.value);
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
    await getAPIWeather();
});

watch([() => selectedCount.value], () => {
    if (selectedCount.value === 0) {
        toggleNext();
    }
    filteredNextWeather.value = weather?.value.next.slice(0, selectedCount.value);
});

function toggleNext() {
    showNext.value = !showNext.value;
    if (!showNext.value) {
        selectedCount.value = 5;
    }
}

function getTempColor(temp) {
    if (isRefreshing.value) {
        return 'text-black dark:text-white';
    }
    let cold = 'text-blue-700 dark:text-blue-500';
    let hot = 'text-red-700 dark:text-red-500';
    let warm = 'text-yellow-700 dark:text-yellow-500';
    switch (selectedUnit.value) {
        case 'imperial':
            return temp > 80 ? hot : temp < 60 ? cold : warm;
        case 'metric':
            return temp > 27 ? hot : temp < 15 ? cold : warm;
        case 'default':
            return temp > 300 ? hot : temp < 288 ? cold : warm;
        default:
            return 'text-black dark:text-white';
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

function getIconWind(deg) {
    if (deg >= 337.5 || deg < 22.5) {
        return mdiArrowUp;
    } else if (deg >= 22.5 && deg < 67.5) {
        return mdiArrowTopRight;
    } else if (deg >= 67.5 && deg < 112.5) {
        return mdiArrowRight;
    } else if (deg >= 112.5 && deg < 157.5) {
        return mdiArrowBottomRight;
    } else if (deg >= 157.5 && deg < 202.5) {
        return mdiArrowDown;
    } else if (deg >= 202.5 && deg < 247.5) {
        return mdiArrowBottomLeft;
    } else if (deg >= 247.5 && deg < 292.5) {
        return mdiArrowLeft;
    } else if (deg >= 292.5 && deg < 337.5) {
        return mdiArrowTopLeft;
    } else {
        return mdiArrowUp;
    }
}
</script>

<template>
    <CardBox :updated="weather?.info.dt">
        <div
            class="flex flex-col lg:flex-row items-center justify-evenly w-full text-black dark:text-white transition-all"
        >
            <div class="flex flex-row lg:flex-col mb-6 my-1 lg:mb-0 items-center gap-3 md:gap-4 justify-center">
                <FormField
                    id="city"
                    v-model="selectedCity"
                    type="select"
                    :options="selectCities"
                    :disabled="isRefreshing"
                    :label="mainStore.lang === 'pt' ? 'Cidade:' : 'City:'"
                    :icon="mdiHomeCity"
                />
                <FormField
                    id="unit"
                    v-model="selectedUnit"
                    type="select"
                    :options="selectUnits"
                    :disabled="isRefreshing"
                    :label="mainStore.lang === 'pt' ? 'Unidade:' : 'Unit:'"
                    :icon="selectUnits.find((unit) => unit.value === selectedUnit).icon"
                />
            </div>
            <div
                class="flex flex-col md:flex-row items-center gap-0 md:gap-4 justify-center"
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
                        class="w-24 h-24 md:w-32 md:h-32 -mt-4 md:mt-0"
                    />
                </div>
                <div>
                    <div class="flex flex-row items-center gap-2 md:gap-4 justify-center">
                        <span class="text-3xl md:text-4xl">{{
                            weather?.info.name ?? (mainStore.lang === 'pt' ? 'Cidade' : 'City')
                        }}</span>
                        <span
                            class="text-3xl md:text-4xl font-bold"
                            :class="getTempColor(weather?.values.temp)"
                            :title="
                                (mainStore.lang === 'pt' ? 'Parece: ' : 'Feels like: ') +
                                (weather?.values.feels_like ?? 0) +
                                getUnitSymbol()
                            "
                            >{{ weather?.values.temp ?? 0 }}{{ getUnitSymbol() }}</span
                        >
                    </div>
                    <div class="flex flex-row items-center gap-2 md:gap-4 justify-center mt-4">
                        <span class="text-md md:text-xl text-gray-800 dark:text-gray-400"
                            >{{ mainStore.lang === 'pt' ? 'Vento' : 'Wind' }}: {{ weather?.values.wind ?? 0
                            }}{{ getWindSymbol() }}</span
                        >
                        <BaseIcon
                            :path="getIconWind(weather?.values.deg)"
                            :size="24"
                            :title="mainStore.lang === 'pt' ? 'Direção do vento' : 'Wind direction'"
                            class="text-gray-800 dark:text-gray-400"
                        />
                        <span class="text-md md:text-xl text-gray-800 dark:text-gray-400"
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
                            class="mt-0 md:mt-1 hover:text-blue-700 dark:hover:text-sky-500 transition-all hover:scale-110"
                            :class="isRefreshing ? 'cursor-not-allowed' : 'cursor-pointer'"
                            @click="isRefreshing ? null : getCities(true)"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-center md:justify-end my-4 lg:my-2 w-full px-8">
            <span
                class="text-md font-semibold text-gray-700 dark:text-slate-400"
                :title="mainStore.lang === 'pt' ? 'Atualizado em' : 'Updated at'"
                >{{ weather?.info.date_time ?? null }}</span
            >
        </div>
        <BaseIcon
            :path="showNext ? mdiArrowUp : mdiArrowDown"
            :size="24"
            :title="mainStore.lang === 'pt' ? 'Mostrar / Ocultar Tempo' : 'Show / Hide Weather'"
            class="mt-2 md:-mt-4 hover:text-blue-700 dark:hover:text-sky-500 transition-all hover:scale-110 cursor-pointer"
            @click="toggleNext"
        />
        <div v-if="showNext" class="w-full px-6">
            <hr class="border-t-2 border-gray-300 dark:border-slate-500 my-4" />
            <NextWeatherCard
                :next-weather="filteredNextWeather"
                :is-refreshing="isRefreshing"
                :selected-unit="selectedUnit"
                :lang="mainStore.lang"
            >
                <FormField v-model="selectedCount" type="numberButton" :disabled="isRefreshing" :min="0" :max="10" />
            </NextWeatherCard>
        </div>
    </CardBox>
</template>
