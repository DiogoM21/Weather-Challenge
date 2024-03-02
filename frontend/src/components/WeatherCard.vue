<script setup>
import { ref, onMounted, watch } from 'vue';
import { mdiReload } from '@mdi/js';
import CardBox from './CardBox.vue';
import BaseIcon from './BaseIcon.vue';
import { useMainStore } from '@/stores/main';
import { useWeatherStore } from '@/stores/weather';

const mainStore = useMainStore();
const weatherStore = useWeatherStore();

const weather = ref(weatherStore.weather);

async function getCurrentWeather() {
    weather.value = await weatherStore.getCurrentWeather('2267094', weatherStore.units, mainStore.lang);
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
        <div class="flex flex-row items-center gap-4 text-gray-900 dark:text-white">
            <div class="mx-2">
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
            <div class="flex flex-col items-center gap-4">
                <div class="flex flex-row items-center gap-4">
                    <span class="text-4xl">Leiria</span>
                    <span class="text-4xl font-bold">{{ weather?.values.temp ?? 0 }}°C</span>
                </div>
                <div class="flex flex-row items-center gap-4">
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
        <template #footer>
            <div class="flex justify-end">
                <span class="text-sm font-bold text-gray-700 dark:text-slate-400">{{ weather?.info.dt ?? null }}</span>
            </div>
        </template>
    </CardBox>
</template>
