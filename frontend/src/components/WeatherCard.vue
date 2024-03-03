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
const isRefreshing = ref(false);

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
const selectedUnit = ref(selectUnits.find((unit) => unit.value === weatherStore.unit).value);

async function getCurrentWeather() {
    isRefreshing.value = true;
    try {
        weather.value = await weatherStore.getCurrentWeather(selectedCity.value, selectedUnit.value, mainStore.lang);
    } finally {
        isRefreshing.value = false;
    }
}

onMounted(async () => {
    await getCurrentWeather();
});

watch([() => mainStore.lang, () => selectedCity.value, () => selectedUnit.value], async () => {
    await getCurrentWeather();
});

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
        <div class="flex flex-row items-center mt-5 justify-evenly w-full text-gray-900 dark:text-white">
            <div class="flex flex-col items-center gap-4 justify-center">
                <FormField
                    v-model="selectedCity"
                    type="select"
                    :options="selectCities"
                    :label="mainStore.lang === 'pt' ? 'Cidade:' : 'City:'"
                    :icon="mdiHomeCity"
                />
                <FormField
                    v-model="selectedUnit"
                    type="select"
                    :options="selectUnits"
                    :label="mainStore.lang === 'pt' ? 'Unidade:' : 'Unit:'"
                    :icon="selectUnits.find((unit) => unit.value === selectedUnit).icon"
                />
            </div>
            <div class="flex flex-row items-center gap-4 justify-center" :class="isRefreshing ? 'animate-pulse' : ''">
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
                        <span class="text-4xl">{{
                            selectCities.find((city) => city.value === selectedCity).label
                        }}</span>
                        <span class="text-4xl font-bold">{{ weather?.values.temp ?? 0 }}{{ getUnitSymbol() }}</span>
                    </div>
                    <div class="flex flex-row items-center gap-4 justify-center mt-4">
                        <span class="text-xl"
                            >{{ mainStore.lang === 'pt' ? 'Vento' : 'Wind' }}: {{ weather?.values.wind ?? 0
                            }}{{ getWindSymbol() }}</span
                        >
                        <span class="text-xl"
                            >{{ mainStore.lang === 'pt' ? 'Direção' : 'Direction' }}:
                            {{ weather?.values.deg ?? 0 }}°</span
                        >
                        <BaseIcon
                            :path="mdiReload"
                            :size="24"
                            :title="mainStore.lang === 'pt' ? 'Atualizar' : 'Refresh'"
                            class="mt-1 hover:text-blue-900 dark:hover:text-sky-500 cursor-pointer transition-colors"
                            @click="getCurrentWeather"
                        />
                    </div>
                    <div class="flex flex-row items-center gap-4 justify-center mt-4">
                        <span class="text-xl"
                            >{{ mainStore.lang === 'pt' ? 'Humidade' : 'Humidity' }}:
                            {{ weather?.values.humidity ?? 0 }}%</span
                        >
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-end">
                <span class="text-sm font-bold text-gray-700 dark:text-slate-400">{{
                    weather?.info.dateTime ?? null
                }}</span>
            </div>
        </template>
    </CardBox>
</template>
